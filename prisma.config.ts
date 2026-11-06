import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// The Prisma CLI (migrate, studio) uses the DIRECT Neon URL. The app uses the pooled DATABASE_URL via the adapter.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: env("DIRECT_URL") },
});
