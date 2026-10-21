export interface Category {
  id: number;
  name: string;
  createdAt: Date;
}

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number | null;
  author: User | null;
  categoryId: number | null;
  category: Category | null;
  createdAt: Date;
}

export type NewPost = {
  title: string;
  content: string;
  authorId: number;
  categoryId: number;
};