import { z } from 'zod';

const MAX_PORT = 65535;
const MIN_JWT_SECRET_LENGTH = 32;

export const envSchema = z.object({
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(MIN_JWT_SECRET_LENGTH),
  PORT: z.coerce.number().int().min(0).max(MAX_PORT).default(3000),
});

export type Env = z.infer<typeof envSchema>;

export const validateEnv = (config: Record<string, unknown>): Env =>
  envSchema.parse(config);
