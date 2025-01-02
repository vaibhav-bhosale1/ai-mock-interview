import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  dbCredentials: {
    url: "postgresql://neondb_owner:ebgkdSMYo13f@ep-winter-rice-a5zy7h81.us-east-2.aws.neon.tech/ai-mock-interview?sslmode=require",
  }
});