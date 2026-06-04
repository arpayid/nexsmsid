import { createApiClient } from "@nexsmsid/api-client";

import { getAccessToken } from "./auth-storage";

export function createBrowserApiClient() {
  return createApiClient({
    accessToken: getAccessToken,
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1"
  });
}
