import type { Category, NewCategory } from "./entity.js";

export interface CategoryRepository {
  getAll(): Promise<Category[]>;
  getById(id: number): Promise<Category | undefined>;
  addCategory(newCategory: NewCategory): Promise<Category>;
}