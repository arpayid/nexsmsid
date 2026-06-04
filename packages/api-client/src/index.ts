import type { HealthStatus } from "@nexsmsid/types";

export type ApiClientOptions = {
  baseUrl?: string;
  fetcher?: typeof fetch;
};

export function createApiClient(options: ApiClientOptions = {}) {
  const baseUrl = options.baseUrl ?? "http://localhost:4000";
  const fetcher = options.fetcher ?? fetch;

  return {
    async health(): Promise<HealthStatus> {
      const response = await fetcher(`${baseUrl}/health`);

      if (!response.ok) {
        throw new Error(`NexSMSID API health check failed: ${response.status}`);
      }

      return response.json() as Promise<HealthStatus>;
    }
  };
}
