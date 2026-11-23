import { createHash, randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

export function createJwtService() {
  const jwtSecret = config.jwtSecret;
  const refreshSecret = config.refreshSecret;

  if (!jwtSecret) throw new Error("JWT_SECRET is not configured");
  if (!refreshSecret) throw new Error("REFRESH_SECRET is not configured");

  return {
    createAccessToken(userId: number, email: string): string {
      return jwt.sign({ userId, email }, jwtSecret, {
        expiresIn: "15m",
      });
    },

    createRefreshToken(userId: number, email: string): string {
      return jwt.sign({ userId, email }, refreshSecret, {
        expiresIn: "17d",
        jwtid: randomUUID(),
      });
    },

    verifyAccessToken(token: string) {
      return jwt.verify(token, jwtSecret) as {
        userId: number;
        email: string;
      };
    },

    verifyRefreshToken(token: string) {
      return jwt.verify(token, refreshSecret) as {
        userId: number;
        email: string;
        jti: string;
        exp: number;
      };
    },

    hashRefreshToken(token: string): string {
      return createHash("sha256").update(token).digest("hex");
    },
  };
}

export type JwtService = ReturnType<typeof createJwtService>;
