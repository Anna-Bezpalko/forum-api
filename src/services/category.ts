import type { 
    Category, 
    NewCategory, 
} from "../domain/category/entity.js"; 
import type { CategoryRepository } from "../domain/category/repository.js";

export interface CategoryService { 
    getCategories(): Promise<Category[]>; 
    getCategoryById(id: number): Promise<Category | undefined>; 
    createCategory(newCategory: NewCategory): Promise<Category>; 
}

export function createCategoryService( 
    repository: CategoryRepository, 
): CategoryService { 
    return { 
        getCategories(): Promise<Category[]> { 
            return repository.getAll(); 
        },
        getCategoryById(id: number): Promise<Category | undefined> {
            return repository.getById(id);
        },
        createCategory(newCategory: NewCategory): Promise<Category> {
            return repository.addCategory(newCategory);
        },
    }; 
}