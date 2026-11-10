import { z } from 'zod';

const MAX_PORT = 65535;

export const envSchema = z.object({
  DATABASE_URL: z.url(),
  PORT: z.coerce.number().int().min(0).max(MAX_PORT).default(3000),
});

export type Env = z.infer<typeof envSchema>;

export const validateEnv = (config: Record<string, unknown>): Env =>
  envSchema.parse(config);
