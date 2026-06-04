export type AppEnvironment = "development" | "test" | "production";

export type HealthStatus = {
  service: string;
  status: "ok";
  timestamp: string;
};
