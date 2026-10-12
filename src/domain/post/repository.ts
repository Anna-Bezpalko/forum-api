import type { Post, NewPost } from "./entity.js";

export interface Repository {
  getAll(category?: string, take?: number): Promise<Post[]>;
  getById(id: number): Promise<Post | undefined>;
  addPost(newPost: NewPost): Promise<Post>;
}