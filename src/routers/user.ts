import { Router } from "express";
import type { UserService } from "../services/user.js";
import { createUserHandlers } from "../handlers/user.js";

export function createUserRouter(service: UserService) {
  const router = Router();
  const { register, login } = createUserHandlers(service);

  router.post("/users/register", register);
  router.post("/users/login", login);

  return router;
}