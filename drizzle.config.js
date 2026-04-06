import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_SyKZJ4WEY6hw@ep-lucky-heart-a1bmbwcg.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  },
});
