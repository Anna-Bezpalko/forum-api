import type { Post, NewPost } from "../domain/post/entity.js"; import type { Repository } from "../domain/post/repository.js"; import { db } from "../prisma/db.js";
export function createPostRepository(): Repository { return { async getAll(category?: string, take?: number): Promise<Post[]> { if (category && take !== undefined) { return await db.orm.public.Post .where((post) => post.category.some({ name: category })) .include("category") .include("author") .limit(take) .all(); }
  if (category) {
    return await db.orm.public.Post
      .where((post) => post.category.some({ name: category }))
      .include("category")
      .include("author")
      .all();
  }

  if (take !== undefined) {
    return await db.orm.public.Post
      .include("category")
      .include("author")
      .limit(take)
      .all();
  }

  return await db.orm.public.Post
    .include("category")
    .include("author")
    .all();
},

async getById(id: number): Promise<Post | undefined> {
  const post = await db.orm.public.Post
    .include("category")
    .include("author")
    .first({ id });

  return post ?? undefined;
},

async addPost(newPost: NewPost): Promise<Post> {
  const created = await db.orm.public.Post.create({
    title: newPost.title,
    content: newPost.content,
    author: (author) =>
      author.connect({ id: newPost.authorId }),
    category: (category) =>
      category.connect({ id: newPost.categoryId }),
  });

  const post = await db.orm.public.Post
    .include("category")
    .include("author")
    .first({ id: created.id });

  if (!post) {
    throw new Error("Created post not found");
  }

  return post;
},
}; }