import "dotenv/config";

export const config = {
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  refreshSecret: process.env.REFRESH_SECRET,
  nodeEnv: process.env.NODE_ENV ?? "development",
  corsOrigin: "http://localhost:5173",
};
