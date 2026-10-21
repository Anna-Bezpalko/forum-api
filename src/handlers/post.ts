import type { Request, Response } from "express"; import type { CreatePostDto } from "../dto/post.js"; import type { PostService } from "../services/types.js";
export function createPostHandlers(service: PostService) { return { async getAllPosts(req: Request, res: Response) { const { category, take } = req.query; let limit: number | undefined;
  if (take !== undefined) {
    limit = Number(take);

    if (!Number.isInteger(limit) || limit < 0) {
      return res.status(422).json({
        message: "Invalid take parameter",
      });
    }
  }

  const posts = await service.getPosts(
    typeof category === "string" ? category : undefined,
    limit,
  );

  return res.status(200).json(posts);
},

async getPost(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid post id",
    });
  }

  const post = await service.getPostById(id);

  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  return res.status(200).json(post);
},

async postPost(
  req: Request<{}, {}, CreatePostDto>,
  res: Response,
) {
  const { title, content, authorId, categoryId } = req.body;

  if (
  typeof title !== "string" ||
  title.trim() === "" ||
  typeof content !== "string" ||
  content.trim() === ""
) {
  return res.status(422).json({
    message: "Invalid post data",
  });
}

  if (
    typeof categoryId !== "number" ||
    !Number.isInteger(categoryId) ||
    categoryId <= 0
  ) {
    return res.status(400).json({
      message: "Invalid categoryId",
    });
  }

  const newPost = {
  title: title.trim(),
  content: content.trim(),
  authorId: Number(req.body.authorId),
  categoryId,
  };

  const post = await service.createPost(newPost);

  return res.status(201).json(post);
},
}; }