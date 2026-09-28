import type { Request, Response } from "express"

import { getPosts, getPostById, createPost, } from "../../services/post.js"
import type { CreatePostDto } from "../../dto/post.js"
export function getAllPosts(req: Request, res: Response) { const { category, take } = req.query
let limit: number | undefined
if (take !== undefined) { limit = Number(take)
if (!Number.isInteger(limit) || limit < 0) {
  return res.status(422).json({
    message: "Invalid take parameter",
  })
}
}
const posts = getPosts( typeof category === "string" ? category : undefined, limit, )
return res.status(200).json(posts) }
export function getPost(req: Request, res: Response) { const id = Number(req.params.id)
if (!Number.isInteger(id) || id <= 0) { return res.status(422).json({ message: "Invalid post id", }) }
const post = getPostById(id)
if (!post) { return res.status(404).json({ message: "Post not found", }) }
return res.status(200).json(post) }
export async function postPost( req: Request<{}, {}, CreatePostDto>, res: Response, ) { const { title, content, author, category } = req.body
if ( typeof title !== "string" || title.trim() === "" || typeof content !== "string" || content.trim() === "" ) { return res.status(422).json({ message: "Invalid post data", }) }
if ( typeof author !== "string" || author.trim() === "" || typeof category !== "string" || category.trim() === "" ) { return res.status(422).json({ message: "Invalid post data", }) }
const newPost = { id: Date.now(), title: title.trim(), content: content.trim(), author: author.trim(), category: category.trim(), }
const post = await createPost(newPost)
return res.status(201).json(post) }