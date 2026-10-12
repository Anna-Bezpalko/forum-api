import type { Post, NewPost } from "../domain/post/entity.js"; 
import type { Repository } from "../domain/post/repository.js"; 
import { db } from "../prisma/db.js";

export function createPostRepository(): Repository { 
  return { 
    async getAll(category?: string, take?: number): Promise<Post[]> { 
      if (category && take !== undefined) { 
        return db.orm.public.Post 
        .where({ category }) 
        .limit(take) 
        .all(); }
      if (category) {
        return db.orm.public.Post.where({ category }).all();
      }
      if (take !== undefined) {
        return db.orm.public.Post.limit(take).all();
      }
      return db.orm.public.Post.all();
    },

    async getById(id: number): Promise<Post | undefined> {
      const post = await db.orm.public.Post.first({ id });
      return post ?? undefined;
    },

    async addPost(newPost: NewPost): Promise<Post> {
      return db.orm.public.Post.create(newPost);
    },
  };  
}
  