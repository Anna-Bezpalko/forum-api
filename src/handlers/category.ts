import type { Request, Response } from "express"; 
import type { CreateCategoryDto } from "../dto/category.js"; 
import type { CategoryService } from "../services/category.js";

export function createCategoryHandlers(service: CategoryService) { 
    return { 
        async getAllCategories(_req: Request, res: Response) { 
            try { 
                const categories = await service.getCategories(); 
                return res.status(200).json(categories); 
            } catch (error) { 
                console.error("Get categories error:", error)
                
                return res.status(500).json({ 
                    message: "Internal server error", 
                }); 
            } 
        },
        async getCategory(req: Request, res: Response) {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    message: "Invalid category id",
                });
            }

            try {
                const category = await service.getCategoryById(id);

                if (!category) {
                    return res.status(404).json({
                        message: "Category not found",
                    });
                }

                return res.status(200).json(category);
            } catch {
                return res.status(500).json({
                    message: "Internal server error",
                });
            }
        },

        async postCategory(
            req: Request<{}, {}, CreateCategoryDto>,
            res: Response,
        ) {
            const { name } = req.body;

            if (typeof name !== "string" || name.trim() === "") {
                return res.status(422).json({
                    message: "Invalid category data",
                });
            }

            try {
                const category = await service.createCategory({
                    name: name.trim(),
                });

            return res.status(201).json(category);
        } catch (error) {
            console.error(error);
                const message =
                    error instanceof Error ? error.message : "";
            if (/unique|duplicate/i.test(message)) {
                return res.status(409).json({
                    message: "Category already exists",
                });
            }

            return res.status(500).json({
                message: "Internal server error",
            });
        }
    },
}; 
}