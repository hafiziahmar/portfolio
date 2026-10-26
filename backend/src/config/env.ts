import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().default('postgres://portfolio_user:portfolio_pass123@localhost:5432/hafizi_portfolio'),
  REDIS_URL: z.string().optional().default('redis://localhost:6379'),
  JWT_SECRET: z.string().min(16).default('super_secret_jwt_key_replace_in_production_min_32_chars'),
  JWT_EXPIRES_IN: z.string().default('24h'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  ADMIN_INITIAL_USERNAME: z.string().default('hafizi_admin'),
  ADMIN_INITIAL_PASSWORD: z.string().default('replace_with_secure_password_in_production'),
  ADMIN_INITIAL_EMAIL: z.string().default('admin@hafizi.dev'),
  GEMINI_API_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
