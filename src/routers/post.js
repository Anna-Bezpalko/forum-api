import express from "express"

import {
  getAllPosts,
  getPost,
  postPost,
} from "../handlers/post.js"

const router = express.Router()

router.get("/posts", getAllPosts)
router.get("/posts/:id", getPost)
router.post("/posts", postPost)

export default router