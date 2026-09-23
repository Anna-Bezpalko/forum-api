import { getPosts, getPostById, createPost, } from "../services/post.js"
export function getAllPosts(req, res) { const { category, take } = req.query
let limit
if (take !== undefined) { limit = Number(take)
if (!Number.isInteger(limit) || limit < 0) {
  return res.status(422).json({ message: "Invalid take parameter" })
}
}
const posts = getPosts(category, limit)
res.status(200).json(posts) }
export function getPost(req, res) { const id = Number(req.params.id)
if (!Number.isInteger(id) || id <= 0) { return res.status(422).json({ message: "Invalid post id" }) }
const post = getPostById(id)
if (!post) { return res.status(404).json({ message: "Post not found" }) }
res.status(200).json(post) }
export async function postPost(req, res) { const { title, content, author, category } = req.body
if ( typeof title !== "string" || title.trim() === "" || typeof content !== "string" || content.trim() === "" ) { return res.status(422).json({ message: "Invalid post data" }) }
if ( typeof author !== "string" || author.trim() === "" || typeof category !== "string" || category.trim() === "" ) { return res.status(422).json({ message: "Invalid post data" }) }
const newPost = { id: Date.now(), title: title.trim(), content: content.trim(), author: author.trim(), category: category.trim(), }
const post = await createPost(newPost)
res.status(201).json(post) }