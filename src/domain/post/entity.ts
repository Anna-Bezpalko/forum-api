export interface Category {
  id: number;
  name: string;
  createdAt: Date;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  categoryId: number | null;
  category: Category | null;
  createdAt: Date;
}

export type NewPost = {
  title: string;
  content: string;
  author: string;
  categoryId: number;
};