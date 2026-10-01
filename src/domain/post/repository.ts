import type { Post } from "./entity.js"

export interface Repository {
  getAll(category?: string, take?: number): Post[]
  getById(id: number): Post | undefined
  addPost(newPost: Post): Promise<Post>
}