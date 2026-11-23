import { Router } from "express";
import { ROUTES } from "../constants/index.js";
import { createCategoryHandlers } from "../handlers/category.js";
import type { CategoryService } from "../services/category.js";

export function createCategoryRouter(service: CategoryService) {
  const router = Router();

  const { getAllCategories, getCategory, postCategory } =
    createCategoryHandlers(service);

  router.get(ROUTES.categories, getAllCategories);
  router.get(`${ROUTES.categories}/:id`, getCategory);
  router.post(ROUTES.categories, postCategory);

  return router;
}
