import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = verifyAccessToken(token);
    res.locals.userId = payload.userId;
    res.locals.email = payload.email;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
}