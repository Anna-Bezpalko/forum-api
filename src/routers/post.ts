import { Router } from "express";
import { ROUTES } from "../constants/index.js";
import { createPostHandlers } from "../handlers/post.js";
import { createRequireAuth } from "../middleware/requireAuth.js";
import type { PostService } from "../services/types.js";
import type { JwtService } from "../utils/jwt.js";

export function createPostRouter(service: PostService, jwtService: JwtService) {
  const router = Router();
  const requireAuth = createRequireAuth(jwtService);

  const { getAllPosts, getPost, postPost } = createPostHandlers(service);

  router.get(ROUTES.posts, getAllPosts);
  router.get(`${ROUTES.posts}/:id`, getPost);
  router.post(ROUTES.posts, requireAuth, postPost);

  return router;
}
