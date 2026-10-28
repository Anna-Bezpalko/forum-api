import { Router } from "express"; 
import type { UserService } from "../services/user.js"; 
import { createUserHandlers } from "../handlers/user.js"; 
import { requireAuth } from "../middleware/requireAuth.js";

export function createUserRouter(service: UserService) { 
  const router = Router(); 
  const { register, login } = createUserHandlers(service);

  router.post("/users/register", register); 
  router.post("/users/login", login);

  router.get("/auth/me", requireAuth, async (req, res) => { 
    const user = await service.me(res.locals.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  });
  router.post("/auth/refresh", async (req, res) => { 
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Refresh token is required" });
    }

    try {
      const tokens = await service.refresh(token);

    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 17 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "Tokens refreshed" });
  } catch {
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    return res.status(401).json({ message: "Invalid refresh token" });
  }
});
return router; 
}