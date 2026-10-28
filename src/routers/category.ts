import { Router } from "express";
import type { CategoryService } from "../services/category.js";
import { createCategoryHandlers } from "../handlers/category.js";

export function createCategoryRouter(service: CategoryService) {
const router = Router();

const {
getAllCategories,
getCategory,
postCategory,
} = createCategoryHandlers(service);

router.get("/categories", getAllCategories);
router.get("/categories/:id", getCategory);
router.post("/categories", postCategory);

return router;
}