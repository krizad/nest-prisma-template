import { z } from 'zod';
import { Logger } from '@nestjs/common';

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'production', 'test', 'staging'])
      .default('development'),

    PORT: z.coerce.number().int().min(0).max(65535).default(3000),

    API_PREFIX: z.string().default('api/v1'),

    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

    JWT_ENABLED: z.enum(['true', 'false']).default('true'),

    JWT_SECRET: z.string().optional(),

    JWT_EXPIRATION: z.string().default('7d'),

    JWT_REFRESH_SECRET: z.string().optional(),

    JWT_REFRESH_EXPIRATION: z.string().default('30d'),

    CORS_ORIGINS: z.string().optional(),

    SWAGGER_ENABLED: z.string().optional(),

    SWAGGER_PATH: z.string().optional(),

    THROTTLE_TTL: z.coerce.number().int().positive().optional(),

    THROTTLE_LIMIT: z.coerce.number().int().positive().optional(),

    PRISMA_QUERY_LOG: z.enum(['true', 'false']).optional(),

    PRISMA_SLOW_QUERY_THRESHOLD_MS: z.coerce
      .number()
      .int()
      .nonnegative()
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.JWT_ENABLED !== 'false' && !data.JWT_SECRET) {
      ctx.addIssue({
        code: 'custom',
        path: ['JWT_SECRET'],
        message: 'JWT_SECRET is required when JWT is enabled',
      });
    }
  });

export type EnvConfig = z.infer<typeof envSchema>;

export function validate(config: Record<string, unknown>): EnvConfig {
  const logger = new Logger('EnvValidation');

  const result = envSchema.safeParse(config);

  if (!result.success) {
    const messages = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    logger.error(`Environment validation failed:\n${messages}`);
    throw new Error(`Environment validation failed:\n${messages}`);
  }

  return result.data;
}
