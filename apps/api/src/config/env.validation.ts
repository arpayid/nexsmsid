import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_PORT: z.coerce.number().int().positive().default(4000),
  API_PREFIX: z.string().min(1).default("api/v1"),
  WEB_ORIGIN: z.string().url().default("http://localhost:3000"),
  DATABASE_URL: z.string().url().default("postgresql://nexsmsid:nexsmsid@localhost:5432/nexsmsid?schema=public"),
  REDIS_URL: z.string().url().default("redis://localhost:6379"),
  JWT_ACCESS_SECRET: z.string().min(16).default("phase-3-change-me-access-secret"),
  JWT_REFRESH_SECRET: z.string().min(16).default("phase-3-change-me-refresh-secret"),
  JWT_ACCESS_EXPIRES_IN: z.string().min(1).default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().min(1).default("7d")
});

export type EnvironmentVariables = z.infer<typeof envSchema>;

export function validateEnvironment(config: Record<string, unknown>) {
  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");

    throw new Error(`Invalid environment configuration: ${message}`);
  }

  return parsed.data;
}
