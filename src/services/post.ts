import type { Post, NewPost } from "../domain/post/entity.js"; 
import type { Repository } from "../domain/post/repository.js"; 
import type { PostService } from "./types.js";

export function createPostService(repository: Repository): PostService { 
    return { 
        getPosts(category?: string, take?: number): Promise<Post[]> { 
            return repository.getAll(category, take); 
        },
        getPostById(id: number): Promise<Post | undefined> {
            return repository.getById(id);
        },
        createPost(newPost: NewPost): Promise<Post> {
            return repository.addPost(newPost);
        },
    }; 
}