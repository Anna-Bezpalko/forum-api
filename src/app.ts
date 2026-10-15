import express from "express";

import { createPostRepository } from "./repositories/post.js";
import { createPostService } from "./services/post.js";
import { createPostRouter } from "./routers/post.js";

import { createCategoryRepository } from "./repositories/category.js";
import { createCategoryService } from "./services/category.js";
import { createCategoryRouter } from "./routers/category.js";

export function createApp() {
const app = express();

const postRepository = createPostRepository();
const postService = createPostService(postRepository);
const postRouter = createPostRouter(postService);

const categoryRepository = createCategoryRepository();
const categoryService = createCategoryService(categoryRepository);
const categoryRouter = createCategoryRouter(categoryService);

app.use(express.json());
app.use(postRouter);
app.use(categoryRouter);

return app;
}