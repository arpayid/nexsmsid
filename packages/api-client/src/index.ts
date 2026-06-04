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

export type DashboardSummary = {
  users: {
    total: number;
    active: number;
    inactive: number;
    suspended: number;
  };
  roles: {
    total: number;
  };
  permissions: {
    total: number;
  };
  auditLogs: {
    total: number;
  };
  refreshTokens: {
    active: number;
  };
};

export type DashboardRoleSummary = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  totalUsers: number;
  activeUsers: number;
  totalPermissions: number;
};

export type DashboardRecentActivity = {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  metadata: unknown;
  actor: {
    id: string;
    email: string;
    name: string;
  } | null;
  createdAt: string;
};

export type DashboardSystemStatus = {
  api: {
    status: string;
    version: string;
    uptime: number;
  };
  database: {
    provider: string;
    status: string;
  };
  redis: {
    configured: boolean;
    available: boolean;
    status: string;
    host?: string;
    port?: number;
  };
  generatedAt: string;
};

export type SchoolProfile = {
  id: string;
  name: string;
  npsn: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  principalName: string | null;
  logoUrl: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MasterDataRecord = Record<string, unknown> & {
  id: string;
  code?: string;
  name: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type MasterDataListOptions = {
  limit?: number;
  page?: number;
  search?: string;
};

export type PersonStatus = "ACTIVE" | "INACTIVE" | "GRADUATED" | "TRANSFERRED" | "RESIGNED";
export type Gender = "MALE" | "FEMALE";
export type EmploymentStatus = "PERMANENT" | "CONTRACT" | "HONORARY" | "PROBATION";
export type GuardianRelation = "FATHER" | "MOTHER" | "GUARDIAN" | "GRANDPARENT" | "SIBLING" | "OTHER";

export type ClassroomReference = {
  id: string;
  code: string;
  name: string;
  level: number;
};

export type StudentRecord = {
  id: string;
  nis: string;
  nisn: string | null;
  name: string;
  gender: Gender;
  birthPlace: string | null;
  birthDate: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  classroomId: string | null;
  classroom?: ClassroomReference | null;
  status: PersonStatus;
  photoUrl: string | null;
  enrolledAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type GuardianRecord = {
  id: string;
  name: string;
  relation: GuardianRelation;
  phone: string;
  email: string | null;
  occupation: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TeacherRecord = {
  id: string;
  nip: string | null;
  nuptk: string | null;
  name: string;
  gender: Gender;
  birthPlace: string | null;
  birthDate: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  employmentStatus: EmploymentStatus;
  status: PersonStatus;
  photoUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StaffRecord = {
  id: string;
  nip: string | null;
  name: string;
  gender: Gender;
  phone: string | null;
  email: string | null;
  address: string | null;
  position: string;
  department: string | null;
  employmentStatus: EmploymentStatus;
  status: PersonStatus;
  photoUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PeopleListOptions = {
  classroomId?: string;
  limit?: number;
  page?: number;
  search?: string;
  status?: string;
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
    },
    async dashboardSummary() {
      const response = await request<DashboardSummary>("/dashboard/summary");
      return response.data;
    },
    async dashboardUserRoleSummary() {
      const response = await request<DashboardRoleSummary[]>("/dashboard/user-role-summary");
      return response.data;
    },
    async dashboardRecentActivities() {
      const response = await request<DashboardRecentActivity[]>("/dashboard/recent-activities");
      return response.data;
    },
    async dashboardSystemStatus() {
      const response = await request<DashboardSystemStatus>("/dashboard/system-status");
      return response.data;
    },
    async schoolProfile() {
      const response = await request<SchoolProfile>("/school-profile");
      return response.data;
    },
    async updateSchoolProfile(input: Partial<Omit<SchoolProfile, "createdAt" | "id" | "updatedAt">>) {
      const response = await request<SchoolProfile>("/school-profile", {
        method: "PATCH",
        body: JSON.stringify(input)
      });
      return response.data;
    },
    async masterDataList(resource: string, options: MasterDataListOptions = {}) {
      const params = new URLSearchParams();

      if (options.page) params.set("page", String(options.page));
      if (options.limit) params.set("limit", String(options.limit));
      if (options.search) params.set("search", options.search);

      const query = params.toString();
      return request<MasterDataRecord[]>(`/${resource}${query ? `?${query}` : ""}`);
    },
    async masterDataCreate(resource: string, input: Record<string, unknown>) {
      const response = await request<MasterDataRecord>(`/${resource}`, {
        method: "POST",
        body: JSON.stringify(input)
      });
      return response.data;
    },
    async masterDataUpdate(resource: string, id: string, input: Record<string, unknown>) {
      const response = await request<MasterDataRecord>(`/${resource}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(input)
      });
      return response.data;
    },
    async masterDataDelete(resource: string, id: string) {
      const response = await request<{ deleted: boolean; id: string }>(`/${resource}/${id}`, {
        method: "DELETE"
      });
      return response.data;
    },
    async listStudents(options: PeopleListOptions = {}) {
      const params = new URLSearchParams();

      if (options.page) params.set("page", String(options.page));
      if (options.limit) params.set("limit", String(options.limit));
      if (options.search) params.set("search", options.search);
      if (options.status) params.set("status", options.status);
      if (options.classroomId) params.set("classroomId", options.classroomId);

      const query = params.toString();
      const response = await request<StudentRecord[]>(`/students${query ? `?${query}` : ""}`);
      return { items: response.data, meta: response.meta as { total: number; page: number; limit: number } | undefined };
    },
    async getStudent(id: string) {
      const response = await request<StudentRecord>(`/students/${id}`);
      return response.data;
    },
    async createStudent(input: Record<string, unknown>) {
      const response = await request<StudentRecord>("/students", {
        method: "POST",
        body: JSON.stringify(input)
      });
      return response.data;
    },
    async updateStudent(id: string, input: Record<string, unknown>) {
      const response = await request<StudentRecord>(`/students/${id}`, {
        method: "PATCH",
        body: JSON.stringify(input)
      });
      return response.data;
    },
    async deleteStudent(id: string) {
      const response = await request<{ deleted: boolean; id: string }>(`/students/${id}`, {
        method: "DELETE"
      });
      return response.data;
    },
    async listGuardians(options: PeopleListOptions = {}) {
      const params = new URLSearchParams();

      if (options.page) params.set("page", String(options.page));
      if (options.limit) params.set("limit", String(options.limit));
      if (options.search) params.set("search", options.search);

      const query = params.toString();
      const response = await request<GuardianRecord[]>(`/guardians${query ? `?${query}` : ""}`);
      return { items: response.data, meta: response.meta as { total: number; page: number; limit: number } | undefined };
    },
    async getGuardian(id: string) {
      const response = await request<GuardianRecord>(`/guardians/${id}`);
      return response.data;
    },
    async createGuardian(input: Record<string, unknown>) {
      const response = await request<GuardianRecord>("/guardians", {
        method: "POST",
        body: JSON.stringify(input)
      });
      return response.data;
    },
    async updateGuardian(id: string, input: Record<string, unknown>) {
      const response = await request<GuardianRecord>(`/guardians/${id}`, {
        method: "PATCH",
        body: JSON.stringify(input)
      });
      return response.data;
    },
    async deleteGuardian(id: string) {
      const response = await request<{ deleted: boolean; id: string }>(`/guardians/${id}`, {
        method: "DELETE"
      });
      return response.data;
    },
    async listTeachers(options: PeopleListOptions = {}) {
      const params = new URLSearchParams();

      if (options.page) params.set("page", String(options.page));
      if (options.limit) params.set("limit", String(options.limit));
      if (options.search) params.set("search", options.search);
      if (options.status) params.set("status", options.status);

      const query = params.toString();
      const response = await request<TeacherRecord[]>(`/teachers${query ? `?${query}` : ""}`);
      return { items: response.data, meta: response.meta as { total: number; page: number; limit: number } | undefined };
    },
    async getTeacher(id: string) {
      const response = await request<TeacherRecord>(`/teachers/${id}`);
      return response.data;
    },
    async createTeacher(input: Record<string, unknown>) {
      const response = await request<TeacherRecord>("/teachers", {
        method: "POST",
        body: JSON.stringify(input)
      });
      return response.data;
    },
    async updateTeacher(id: string, input: Record<string, unknown>) {
      const response = await request<TeacherRecord>(`/teachers/${id}`, {
        method: "PATCH",
        body: JSON.stringify(input)
      });
      return response.data;
    },
    async deleteTeacher(id: string) {
      const response = await request<{ deleted: boolean; id: string }>(`/teachers/${id}`, {
        method: "DELETE"
      });
      return response.data;
    },
    async listStaffs(options: PeopleListOptions = {}) {
      const params = new URLSearchParams();

      if (options.page) params.set("page", String(options.page));
      if (options.limit) params.set("limit", String(options.limit));
      if (options.search) params.set("search", options.search);
      if (options.status) params.set("status", options.status);

      const query = params.toString();
      const response = await request<StaffRecord[]>(`/staffs${query ? `?${query}` : ""}`);
      return { items: response.data, meta: response.meta as { total: number; page: number; limit: number } | undefined };
    },
    async getStaff(id: string) {
      const response = await request<StaffRecord>(`/staffs/${id}`);
      return response.data;
    },
    async createStaff(input: Record<string, unknown>) {
      const response = await request<StaffRecord>("/staffs", {
        method: "POST",
        body: JSON.stringify(input)
      });
      return response.data;
    },
    async updateStaff(id: string, input: Record<string, unknown>) {
      const response = await request<StaffRecord>(`/staffs/${id}`, {
        method: "PATCH",
        body: JSON.stringify(input)
      });
      return response.data;
    },
    async deleteStaff(id: string) {
      const response = await request<{ deleted: boolean; id: string }>(`/staffs/${id}`, {
        method: "DELETE"
      });
      return response.data;
    }
  };
}
