import express from "express"; 
import { createPostRepository } from "./repositories/post.js"; 
import { createPostService } from "./services/post.js"; 
import { createPostRouter } from "./routers/post.js";

const app = express(); 
const PORT = 3000;

const repository = createPostRepository(); 
const service = createPostService(repository); 
const postRouter = createPostRouter(service);

app.use(express.json()); app.use(postRouter);
app.listen(PORT, () => { console.log(`Server is running on http://localhost:${PORT}`); });