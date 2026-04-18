import { z } from 'zod';

import { Environment } from '../common/enums/environment.enum';

export const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  NODE_ENV: z.enum(Environment).default(Environment.Development),
  APP_NAME: z.string().trim().min(1).default('nestjs-boilerplate'),
  APP_VERSION: z.string().trim().min(1).default('1.0.0'),
  API_PREFIX: z.string().trim().min(1).default('api'),
  CORS_ORIGIN: z.string().trim().min(1).default('*'),
});

export type EnvironmentVariables = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): EnvironmentVariables {
  const parsed = envSchema.safeParse(config);

  if (parsed.success) {
    return parsed.data;
  }

  const issues = parsed.error.issues
    .map((issue) => `${issue.path.join('.') || 'env'}: ${issue.message}`)
    .join('\n');

  throw new Error(`Environment validation failed:\n${issues}`);
}
