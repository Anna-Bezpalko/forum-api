import {
  getAll,
  getById,
  addPost,
} from "../repositories/post.js"

import type { Post } from "../dto/post.js"

export function getPosts(
  category?: string,
  take?: number,
): Post[] {
  return getAll(category, take)
}

export function getPostById(
  id: number,
): Post | undefined {
  return getById(id)
}

export function createPost(
  newPost: Post,
): Promise<Post> {
  return addPost(newPost)
}