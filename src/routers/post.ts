import { Router } from "express";
import type { PostService } from "../services/types.js";
import { createPostHandlers } from "../handlers/post.js";

export function createPostRouter(service: PostService) {
  const router = Router();

  const {
    getAllPosts,
    getPost,
    postPost,
  } = createPostHandlers(service);

  router.get("/posts", getAllPosts);
  router.get("/posts/:id", getPost);
  router.post("/posts", postPost);

  return router;
}