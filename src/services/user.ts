import bcrypt from "bcryptjs"; 
import type { User, NewUser } from "../domain/user/entity.js"; 
import type { UserRepository } from "../domain/user/repository.js"; 
import { 
    createAccessToken, 
    createRefreshToken, 
    verifyRefreshToken, 
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
}

export function createUserService(repository: UserRepository): UserService { 
    return { 
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

            return {
                accessToken: createAccessToken(user.id, user.email),
                refreshToken: createRefreshToken(user.id, user.email),
            };
        },

        async refresh(token: string): Promise<AuthTokens> {
            try {
                const payload = verifyRefreshToken(token);
                const user = await repository.getById(payload.userId);

                if (!user || user.email !== payload.email) {
                    throw new Error("INVALID_REFRESH_TOKEN");
                }

                return {
                    accessToken: createAccessToken(user.id, user.email),
                    refreshToken: createRefreshToken(user.id, user.email),
                };
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