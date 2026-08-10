import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),

  CORS_ORIGIN: z.string().default("http://localhost:5173"),

  COGNODB_URI: z.string().min(1),

  COGNODB_USERNAME: z.string().min(1),

  COGNODB_PASSWORD: z.string().min(1),
});

export const env = envSchema.parse(process.env);