export interface Category {
  id: number;
  name: string;
  createdAt: Date;
}

export type NewCategory = Omit<Category, "id" | "createdAt">;