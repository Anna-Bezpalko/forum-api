import type { Category, NewCategory } from "../domain/category/entity.js"; 
import type { CategoryRepository } from "../domain/category/repository.js"; 
import { db } from "../prisma/db.js";

export function createCategoryRepository(): CategoryRepository { 
    return { 
        async getAll(): Promise<Category[]> { 
            return await db.orm.public.Category.all(); 
        },
        async getById(id: number): Promise<Category | undefined> {
            const category = await db.orm.public.Category.first({ id });
            return category ?? undefined;
        },
        async addCategory(newCategory: NewCategory): Promise<Category> {
            return await db.orm.public.Category.create(newCategory);
        },
    }; 
}