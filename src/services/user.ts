import type { RefreshSessionRepository } from "../domain/refresh-session/repository.js";
import type { NewUser, User } from "../domain/user/entity.js";
import type { UserRepository } from "../domain/user/repository.js";
import type { JwtService } from "../utils/jwt.js";
import type { PasswordHasher } from "../utils/passwordHasher.js";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthService {
  register(newUser: NewUser): Promise<User>;
  login(email: string, password: string): Promise<AuthTokens>;
  refresh(token: string): Promise<AuthTokens>;
  me(userId: number): Promise<{ id: number; email: string } | undefined>;
  logout(token: string): Promise<void>;
}

export type UserService = AuthService;

interface AuthServiceDependencies {
  userRepository: UserRepository;
  refreshSessionRepository: RefreshSessionRepository;
  passwordHasher: PasswordHasher;
  jwtService: JwtService;
}

export function createAuthService({
  userRepository,
  refreshSessionRepository,
  passwordHasher,
  jwtService,
}: AuthServiceDependencies): AuthService {
  return {
    async register(newUser: NewUser): Promise<User> {
      const existingUser = await userRepository.getByEmail(newUser.email);

      if (existingUser) {
        throw new Error("EMAIL_ALREADY_EXISTS");
      }

      const hashedPassword = await passwordHasher.hash(newUser.password);

      return userRepository.addUser({
        name: newUser.name,
        email: newUser.email,
        password: hashedPassword,
      });
    },

    async login(email: string, password: string): Promise<AuthTokens> {
      const user = await userRepository.getByEmail(email);

      if (!user || !(await passwordHasher.compare(password, user.password))) {
        throw new Error("INVALID_CREDENTIALS");
      }

      const accessToken = jwtService.createAccessToken(user.id, user.email);
      const refreshToken = jwtService.createRefreshToken(user.id, user.email);
      const payload = jwtService.verifyRefreshToken(refreshToken);

      await refreshSessionRepository.addSession({
        userId: user.id,
        tokenHash: jwtService.hashRefreshToken(refreshToken),
        jwtId: payload.jti,
        expiresAt: new Date(payload.exp * 1000),
      });

      return { accessToken, refreshToken };
    },

    async refresh(token: string): Promise<AuthTokens> {
      try {
        const payload = jwtService.verifyRefreshToken(token);
        const user = await userRepository.getById(payload.userId);

        if (!user || user.email !== payload.email) {
          throw new Error("INVALID_REFRESH_TOKEN");
        }

        const tokenHash = jwtService.hashRefreshToken(token);
        const session =
          await refreshSessionRepository.getByTokenHash(tokenHash);

        if (
          !session ||
          session.jwtId !== payload.jti ||
          session.expiresAt <= new Date()
        ) {
          throw new Error("INVALID_REFRESH_TOKEN");
        }

        await refreshSessionRepository.deleteByTokenHash(tokenHash);

        const accessToken = jwtService.createAccessToken(user.id, user.email);
        const refreshToken = jwtService.createRefreshToken(user.id, user.email);
        const newPayload = jwtService.verifyRefreshToken(refreshToken);

        await refreshSessionRepository.addSession({
          userId: user.id,
          tokenHash: jwtService.hashRefreshToken(refreshToken),
          jwtId: newPayload.jti,
          expiresAt: new Date(newPayload.exp * 1000),
        });

        return { accessToken, refreshToken };
      } catch {
        throw new Error("INVALID_REFRESH_TOKEN");
      }
    },

    async me(
      userId: number,
    ): Promise<{ id: number; email: string } | undefined> {
      const user = await userRepository.getById(userId);

      if (!user) return undefined;

      return { id: user.id, email: user.email };
    },

    async logout(token: string): Promise<void> {
      const tokenHash = jwtService.hashRefreshToken(token);
      await refreshSessionRepository.deleteByTokenHash(tokenHash);
    },
  };
}
