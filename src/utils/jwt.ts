import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

export function createAccessToken(userId: number, email: string): string {
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not configured");

  return jwt.sign({ userId, email }, JWT_SECRET, {
    expiresIn: "15m",
  });
}

export function createRefreshToken(userId: number, email: string): string {
  if (!REFRESH_SECRET) throw new Error("REFRESH_SECRET is not configured");

  return jwt.sign({ userId, email }, REFRESH_SECRET, {
    expiresIn: "17d",
  });
}

export function verifyAccessToken(token: string) {
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not configured");

  return jwt.verify(token, JWT_SECRET) as {
    userId: number;
    email: string;
  };
}

export function verifyRefreshToken(token: string) {
  if (!REFRESH_SECRET) throw new Error("REFRESH_SECRET is not configured");

  return jwt.verify(token, REFRESH_SECRET) as {
    userId: number;
    email: string;
  };
}