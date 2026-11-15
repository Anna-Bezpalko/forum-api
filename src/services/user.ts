import bcrypt from "bcryptjs";
import type { User, NewUser } from "../domain/user/entity.js";
import type { UserRepository } from "../domain/user/repository.js";
import type { RefreshSessionRepository } from "../domain/refresh-session/repository.js";
import {
createAccessToken,
createRefreshToken,
verifyRefreshToken,
hashRefreshToken,
} from "../utils/jwt.js";

export interface AuthTokens {
accessToken: string;
refreshToken: string;
}

export interface UserService {
register(newUser: NewUser): Promise<User>;
login(email: string, password: string): Promise<AuthTokens>;
refresh(token: string): Promise<AuthTokens>;
me(userId: number): Promise<{ id: number; email: string } | undefined>;
logout(token: string): Promise<void>;
}

export function createUserService(
repository: UserRepository,
refreshSessionRepository: RefreshSessionRepository
): UserService {
return {
    async logout(token: string): Promise<void> {
    const tokenHash = hashRefreshToken(token);
    await refreshSessionRepository.deleteByTokenHash(tokenHash);
},
async register(newUser: NewUser): Promise<User> {
const existingUser = await repository.getByEmail(newUser.email);
if (existingUser) throw new Error("EMAIL_ALREADY_EXISTS");

        const hashedPassword = await bcrypt.hash(newUser.password, 10);

        return repository.addUser({
            name: newUser.name,
            email: newUser.email,
            password: hashedPassword,
        });
    },

    async login(email: string, password: string): Promise<AuthTokens> {
        const user = await repository.getByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error("INVALID_CREDENTIALS");
        }

        const accessToken = createAccessToken(user.id, user.email);
        const refreshToken = createRefreshToken(user.id, user.email);
        const payload = verifyRefreshToken(refreshToken);

        await refreshSessionRepository.addSession({
            userId: user.id,
            tokenHash: hashRefreshToken(refreshToken),
            jwtId: payload.jti,
            expiresAt: new Date(payload.exp * 1000),
        });

        return { accessToken, refreshToken };
    },

    async refresh(token: string): Promise<AuthTokens> {
        try {
            const payload = verifyRefreshToken(token);
            const user = await repository.getById(payload.userId);

            if (!user || user.email !== payload.email) {
                throw new Error("INVALID_REFRESH_TOKEN");
            }

            const tokenHash = hashRefreshToken(token);
            const session = await refreshSessionRepository.getByTokenHash(tokenHash);

            if (
                !session ||
                session.jwtId !== payload.jti ||
                session.expiresAt <= new Date()
            ) {
                throw new Error("INVALID_REFRESH_TOKEN");
            }

            await refreshSessionRepository.deleteByTokenHash(tokenHash);

            const accessToken = createAccessToken(user.id, user.email);
            const refreshToken = createRefreshToken(user.id, user.email);
            const newPayload = verifyRefreshToken(refreshToken);

            await refreshSessionRepository.addSession({
                userId: user.id,
                tokenHash: hashRefreshToken(refreshToken),
                jwtId: newPayload.jti,
                expiresAt: new Date(newPayload.exp * 1000),
            });

            return { accessToken, refreshToken };
        } catch {
            throw new Error("INVALID_REFRESH_TOKEN");
        }
    },

    async me(userId: number): Promise<{ id: number; email: string } | undefined> {
        const user = await repository.getById(userId);

        if (!user) return undefined;

        return { id: user.id, email: user.email };
    },
};
}