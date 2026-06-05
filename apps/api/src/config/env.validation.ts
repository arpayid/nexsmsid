import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_PORT: z.coerce.number().int().positive().default(4000),
  API_PREFIX: z.string().min(1).default("api/v1"),
  WEB_ORIGIN: z.string().min(1).default("http://localhost:3000"),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().default("redis://localhost:6379"),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().min(1).default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().min(1).default("7d"),
  RATE_LIMIT_TTL: z.coerce.number().int().positive().default(60),
  RATE_LIMIT_LIMIT: z.coerce.number().int().positive().default(100),
  LOG_LEVEL: z.enum(["error", "warn", "log", "debug", "verbose"]).default("log"),
  STORAGE_PATH: z.string().default("./storage"),
  REPORT_STORAGE_PATH: z.string().default("./storage/reports"),
});

export type EnvironmentVariables = z.infer<typeof envSchema>;

export function validateEnvironment(config: Record<string, unknown>) {
  // In production, ensure some variables are explicitly set and not defaults
  if (config.NODE_ENV === "production") {
    if (!config.WEB_ORIGIN || config.WEB_ORIGIN === "http://localhost:3000") {
      throw new Error("WEB_ORIGIN must be a production URL in production mode");
    }
    if (config.JWT_ACCESS_SECRET === "phase-3-change-me-access-secret" || (config.JWT_ACCESS_SECRET as string)?.length < 64) {
      throw new Error("JWT_ACCESS_SECRET must be at least 64 characters in production mode");
    }
  }

  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");

    throw new Error(`Invalid environment configuration: ${message}`);
  }

  return parsed.data;
}
