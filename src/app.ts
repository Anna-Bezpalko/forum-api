import express from "express";
import cookieParser from "cookie-parser";

import { createPostRepository } from "./repositories/post.js";
import { createPostService } from "./services/post.js";
import { createPostRouter } from "./routers/post.js";

import { createCategoryRepository } from "./repositories/category.js";
import { createCategoryService } from "./services/category.js";
import { createCategoryRouter } from "./routers/category.js";

import { createUserRepository } from "./repositories/user.js";
import { createUserService } from "./services/user.js";
import { createUserRouter } from "./routers/user.js";

import cors from "cors";

export function createApp() {
  const app = express();

  app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
  app.use(express.json());
  app.use(cookieParser());

  const postRepository = createPostRepository();
  const postService = createPostService(postRepository);
  const postRouter = createPostRouter(postService);

  const categoryRepository = createCategoryRepository();
  const categoryService = createCategoryService(categoryRepository);
  const categoryRouter = createCategoryRouter(categoryService);

  const userRepository = createUserRepository();
  const userService = createUserService(userRepository);
  const userRouter = createUserRouter(userService);

  app.use(postRouter);
  app.use(categoryRouter);
  app.use(userRouter);

  return app;
}