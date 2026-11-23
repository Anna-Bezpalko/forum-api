import { Router } from "express";
import { COOKIES, ROUTES } from "../constants/index.js";
import { createUserHandlers } from "../handlers/user.js";
import { createRequireAuth } from "../middleware/requireAuth.js";
import type { UserService } from "../services/user.js";
import { clearAuthCookies, setAuthCookies } from "../utils/authCookies.js";
import type { JwtService } from "../utils/jwt.js";

export function createUserRouter(service: UserService, jwtService: JwtService) {
  const router = Router();
  const requireAuth = createRequireAuth(jwtService);
  const { register, login } = createUserHandlers(service);

  router.post(ROUTES.register, register);
  router.post(ROUTES.login, login);

  router.get(ROUTES.me, requireAuth, async (_req, res) => {
    const user = await service.me(res.locals.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  });

  router.post(ROUTES.refresh, async (req, res) => {
    const token = req.cookies?.[COOKIES.refreshToken];

    if (!token) {
      return res.status(401).json({ message: "Refresh token is required" });
    }

    try {
      const tokens = await service.refresh(token);

      setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

      return res.status(200).json({ message: "Tokens refreshed" });
    } catch {
      clearAuthCookies(res);

      return res.status(401).json({ message: "Invalid refresh token" });
    }
  });

  router.post(ROUTES.logout, async (req, res) => {
    const token = req.cookies?.[COOKIES.refreshToken];

    try {
      if (token) {
        await service.logout(token);
      }

      clearAuthCookies(res);

      return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  return router;
}
