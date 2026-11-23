import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { config } from "./config.js";
import type { Container } from "./container.js";

export function createApp(container: Container) {
  const app = express();

  app.use(
    cors({
      origin: config.corsOrigin,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(cookieParser());

  app.use(container.postRouter);
  app.use(container.categoryRouter);
  app.use(container.userRouter);

  return app;
}
