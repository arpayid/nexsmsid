export const appConfig = {
  appName: "NexSMSID",
  apiPort: 4000,
  webPort: 3000,
  postgresPort: 5432,
  redisPort: 6379
} as const;

export type AppConfig = typeof appConfig;
