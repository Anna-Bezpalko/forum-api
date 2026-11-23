import { createDatabase } from "./prisma/db.js";
import { createCategoryRepository } from "./repositories/category.js";
import { createPostRepository } from "./repositories/post.js";
import { createRefreshSessionRepository } from "./repositories/refreshSession.js";
import { createUserRepository } from "./repositories/user.js";
import { createCategoryRouter } from "./routers/category.js";
import { createPostRouter } from "./routers/post.js";
import { createUserRouter } from "./routers/user.js";
import { createCategoryService } from "./services/category.js";
import { createPostService } from "./services/post.js";
import { createAuthService } from "./services/user.js";
import { createJwtService } from "./utils/jwt.js";
import { createPasswordHasher } from "./utils/passwordHasher.js";

export function createContainer() {
  const db = createDatabase();

  const passwordHasher = createPasswordHasher();
  const jwtService = createJwtService();

  const postRepository = createPostRepository(db);
  const categoryRepository = createCategoryRepository(db);
  const userRepository = createUserRepository(db);
  const refreshSessionRepository = createRefreshSessionRepository(db);

  const postService = createPostService(postRepository);
  const categoryService = createCategoryService(categoryRepository);

  const authService = createAuthService({
    userRepository,
    refreshSessionRepository,
    passwordHasher,
    jwtService,
  });

  return {
    postRouter: createPostRouter(postService, jwtService),
    categoryRouter: createCategoryRouter(categoryService),
    userRouter: createUserRouter(authService, jwtService),
  };
}

export type Container = ReturnType<typeof createContainer>;
