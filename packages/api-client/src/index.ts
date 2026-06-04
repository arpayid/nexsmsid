import type { HealthStatus } from "@nexsmsid/types";

export type ApiResponse<TData = unknown, TMeta = unknown> = {
  success: boolean;
  message: string;
  data: TData;
  meta?: TMeta;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: number;
  user: AuthUser;
};

export type UserSummary = {
  id: string;
  email: string;
  username: string | null;
  name: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  roles: Array<{ id: string; name: string; slug: string }>;
};

export type RoleSummary = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  permissions: Array<{ id: string; key: string; name: string; group: string }>;
};

export type PermissionSummary = {
  id: string;
  key: string;
  name: string;
  group: string;
  description: string | null;
};

export type ApiClientOptions = {
  accessToken?: string | (() => string | null | undefined);
  baseUrl?: string;
  fetcher?: typeof fetch;
};

export function createApiClient(options: ApiClientOptions = {}) {
  const baseUrl = (options.baseUrl ?? "http://localhost:4000/api/v1").replace(/\/$/, "");
  const fetcher = options.fetcher ?? fetch;

  async function request<TData>(path: string, init: RequestInit = {}) {
    const headers = new Headers(init.headers);
    const token = typeof options.accessToken === "function" ? options.accessToken() : options.accessToken;

    if (!headers.has("Content-Type") && init.body) {
      headers.set("Content-Type", "application/json");
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetcher(`${baseUrl}${path}`, {
      ...init,
      headers
    });
    const payload = (await response.json().catch(() => null)) as ApiResponse<TData> | null;

    if (!response.ok || !payload?.success) {
      throw new Error(payload?.message ?? `NexSMSID API request failed: ${response.status}`);
    }

    return payload;
  }

  return {
    async health(): Promise<HealthStatus> {
      const response = await request<HealthStatus>("/health");
      return response.data;
    },
    async login(input: { email: string; password: string }) {
      const response = await request<AuthTokens>("/auth/login", {
        method: "POST",
        body: JSON.stringify(input)
      });
      return response.data;
    },
    async refresh(refreshToken: string) {
      const response = await request<AuthTokens>("/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refreshToken })
      });
      return response.data;
    },
    async logout(refreshToken?: string) {
      const response = await request<{ revokedRefreshTokens: number }>("/auth/logout", {
        method: "POST",
        body: JSON.stringify(refreshToken ? { refreshToken } : {})
      });
      return response.data;
    },
    async me() {
      const response = await request<AuthUser>("/auth/me");
      return response.data;
    },
    async users() {
      return request<UserSummary[]>("/users");
    },
    async roles() {
      return request<RoleSummary[]>("/roles");
    },
    async permissions() {
      return request<PermissionSummary[]>("/permissions");
    }
  };
}
