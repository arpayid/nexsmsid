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

// Phase 7 - Teaching Assignment, Schedule, Attendance, Grades
export type DayOfWeek = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
export type AttendanceStatus = "PRESENT" | "SICK" | "PERMIT" | "ABSENT" | "LATE";
export type AssessmentType = "QUIZ" | "MID_EXAM" | "FINAL_EXAM" | "PRACTICE" | "ASSIGNMENT" | "PROJECT" | "OTHER";
export type GradeStatusType = "DRAFT" | "SUBMITTED" | "APPROVED" | "PUBLISHED";

export type TeachingAssignmentRecord = {
  id: string;
  teacherId: string;
  subjectId: string;
  classroomId: string;
  academicYearId: string;
  semesterId: string;
  isActive: boolean;
  teacher?: { id: string; name: string };
  subject?: { id: string; name: string; code: string };
  classroom?: { id: string; name: string; code: string };
  semester?: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
};

export type ScheduleRecord = {
  id: string;
  teachingAssignmentId: string;
  dayOfWeek: DayOfWeek;
  lessonHourId: string;
  roomId: string | null;
  isActive: boolean;
  teachingAssignment: { id: string; teacher: { id: string; name: string }; subject: { id: string; name: string; code: string }; classroom: { id: string; name: string; code: string } };
  lessonHour: { id: string; name: string; startTime: string; endTime: string };
  room: { id: string; name: string; code: string } | null;
  createdAt: string;
  updatedAt: string;
};

export type AttendanceSessionRecord = {
  id: string;
  scheduleId: string;
  date: string;
  topic: string | null;
  notes: string | null;
  schedule?: { id: string; teachingAssignment: { teacher: { id: string; name: string }; subject: { id: string; name: string; code: string }; classroom: { id: string; name: string; code: string } }; lessonHour: { id: string; name: string; startTime: string; endTime: string } };
  _count?: { records: number };
  createdAt: string;
  updatedAt: string;
};

export type AttendanceRecordRecord = {
  id: string;
  sessionId: string;
  studentId: string;
  status: AttendanceStatus;
  note: string | null;
  student?: { id: string; name: string; nis: string; nisn: string | null };
};

export type AttendanceSessionDetail = AttendanceSessionRecord & {
  schedule: { id: string; teachingAssignment: { teacher: { id: string; name: string }; subject: { id: string; name: string; code: string }; classroom: { id: string; name: string; code: string } }; lessonHour: { id: string; name: string; startTime: string; endTime: string }; room: { id: string; name: string; code: string } | null };
  records: Array<{ id: string; sessionId: string; studentId: string; status: AttendanceStatus; note: string | null; student: { id: string; name: string; nis: string; nisn: string | null } }>;
};

export type AttendanceClassroomSummary = {
  date: string;
  classroom: { id: string; name: string };
  totalStudents: number;
  present: number;
  sick: number;
  permit: number;
  absent: number;
  late: number;
  unrecorded: number;
  records: Array<{ student: { id: string; name: string; nis: string }; status: AttendanceStatus | null; notes: string | null }>;
};

export type AttendanceStudentSummary = {
  studentId: string;
  studentName: string;
  totalSessions: number;
  present: number;
  sick: number;
  permit: number;
  absent: number;
  late: number;
  attendanceRate: number;
};

export type AssessmentRecord = {
  id: string;
  teachingAssignmentId: string;
  name: string;
  type: AssessmentType;
  description: string | null;
  maxScore: number;
  weight: number;
  dueDate: string | null;
  teachingAssignment?: TeachingAssignmentRecord;
  _count?: { grades: number };
  createdAt: string;
  updatedAt: string;
};

export type GradeRecord = {
  id: string;
  assessmentId: string;
  studentId: string;
  score: number;
  status: GradeStatusType;
  student?: { id: string; name: string; nis: string };
};

export type AssessmentDetail = AssessmentRecord & {
  teachingAssignment: { id: string; teacher: { id: string; name: string }; subject: { id: string; name: string; code: string }; classroom: { id: string; name: string; code: string } };
  grades: Array<{ id: string; assessmentId: string; studentId: string; score: number; notes: string | null; status: GradeStatusType; gradedAt: string | null; student: { id: string; name: string; nis: string; nisn: string | null } }>;
};

export type GradesClassroomSummary = Record<string, unknown>;
export type GradesStudentSummary = Record<string, unknown>;

export type InvoiceRecord = Record<string, unknown>;
export type PaymentRecord = Record<string, unknown>;
export type ExpenseRecord = Record<string, unknown>;
export type FinanceSummary = Record<string, unknown>;
export type PpdbPeriodRecord = Record<string, unknown>;
export type PpdbRegistrationRecord = Record<string, unknown>;
export type IndustryPartnerRecord = Record<string, unknown>;
export type InternshipRecord = Record<string, unknown>;
export type InternshipLogRecord = Record<string, unknown>;
export type AlumniRecord = Record<string, unknown>;
export type JobVacancyRecord = Record<string, unknown>;
export type JobApplicationRecord = Record<string, unknown>;
export type TracerStudyRecord = Record<string, unknown>;
export type BkkSummary = Record<string, unknown>;
export type AnnouncementRecord = Record<string, unknown>;
export type InternalMessageRecord = Record<string, unknown>;
export type NotificationRecord = Record<string, unknown>;
export type NotificationTemplateRecord = Record<string, unknown>;
export type ReportJobRecord = Record<string, unknown>;
export type ExportHistoryRecord = Record<string, unknown>;
export type ReportCenterSummary = Record<string, unknown>;
export type CounselingCaseRecord = Record<string, unknown>;
export type CounselingNoteRecord = Record<string, unknown>;
export type DisciplineRuleRecord = Record<string, unknown>;
export type DisciplineViolationRecord = Record<string, unknown>;
export type StudentAchievementRecord = Record<string, unknown>;
export type DisciplineSummaryRecord = Record<string, unknown>;
export type LetterTemplateRecord = Record<string, unknown>;
export type LetterRecord = Record<string, unknown>;
export type LetterSummaryRecord = Record<string, unknown>;

export type ApiClientOptions = {
  accessToken?: string | (() => string | null | undefined);
  baseUrl?: string;
  fetcher?: typeof fetch;
};

export type ExamTypeRecord = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ExamRoomRecord = {
  id: string;
  code: string;
  name: string;
  capacity: number;
  location?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ExamRecord = {
  id: string;
  examTypeId: string;
  academicYearId: string;
  semesterId?: string | null;
  code: string;
  name: string;
  description?: string | null;
  duration: number;
  totalQuestions?: number | null;
  maxScore?: number | null;
  passingScore?: number | null;
  status: string;
  isCbt: boolean;
  instruction?: string | null;
  notes?: string | null;
  examType?: ExamTypeRecord;
  academicYear?: any;
  semester?: any;
  _count?: { schedules: number; participants: number; questions: number };
  schedules?: ExamScheduleRecord[];
  createdAt: string;
  updatedAt: string;
};

export type ExamScheduleRecord = {
  id: string;
  examId: string;
  roomId?: string | null;
  date: string;
  startTime: string;
  endTime: string;
  supervisorId?: string | null;
  notes?: string | null;
  room?: ExamRoomRecord | null;
  supervisor?: any;
  sessions?: ExamSessionRecord[];
  createdAt: string;
  updatedAt: string;
};

export type ExamSessionRecord = {
  id: string;
  scheduleId: string;
  code: string;
  name?: string | null;
  status: string;
  startedAt?: string | null;
  endedAt?: string | null;
  token?: string | null;
  _count?: { participants: number; attendances: number };
  createdAt: string;
  updatedAt: string;
};

export type ExamParticipantRecord = {
  id: string;
  examId: string;
  sessionId?: string | null;
  studentId: string;
  number?: number | null;
  status: string;
  score?: number | null;
  notes?: string | null;
  student?: any;
  session?: ExamSessionRecord | null;
  createdAt: string;
  updatedAt: string;
};

export type ExamQuestionRecord = {
  id: string;
  examId: string;
  bankId?: string | null;
  number: number;
  type: string;
  content: string;
  options?: any;
  correctAnswer?: string | null;
  score: number;
  attachmentUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ImportResult = {
  totalRows: number;
  successRows: number;
  failedRows: number;
  errors: Array<{ row?: number; field?: string; message: string }>;
};

export function createApiClient(options: ApiClientOptions = {}) {
  const baseUrl = (options.baseUrl ?? "http://localhost:4000/api/v1").replace(/\/$/, "");
  const fetcher = options.fetcher ?? fetch;

  function authHeaders() {
    const token = typeof options.accessToken === "function" ? options.accessToken() : options.accessToken;
    const headers = new Headers();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  }

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

  async function downloadFile(path: string, fallbackFilename: string): Promise<Blob> {
    const response = await fetcher(`${baseUrl}${path}`, { headers: authHeaders() });
    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as ApiResponse<unknown> | null;
      throw new Error(payload?.message ?? `NexSMSID API request failed: ${response.status}`);
    }
    const blob = await response.blob();
    const headerDisposition = response.headers.get("Content-Disposition") ?? "";
    const match = headerDisposition.match(/filename="?([^";]+)"?/i);
    const filename = match?.[1] ?? fallbackFilename;
    return new Blob([blob], { type: blob.type || "application/octet-stream" }).slice(0, blob.size, blob.type) as Blob;
  }

  function triggerBrowserDownload(blob: Blob, filename: string) {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function buildQuery(options: Record<string, unknown> = {}) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(options)) {
      if (value === undefined || value === null || value === "") continue;
      params.set(key, String(value));
    }
    const query = params.toString();
    return query ? `?${query}` : "";
  }

  function normalizeListResponse(response: ApiResponse<any>) {
    const payload = response.data;
    if (Array.isArray(payload)) return { data: payload, meta: response.meta };
    return { data: payload?.data ?? [], meta: payload?.meta ?? response.meta };
  }

  async function uploadFile<TData>(path: string, file: Blob | File, fieldName = "file", fallbackFilename = "upload.xlsx") {
    const formData = new FormData();
    const filename = (file as { name?: string }).name ?? fallbackFilename;
    formData.append(fieldName, file, filename);
    const response = await fetcher(`${baseUrl}${path}`, {
      method: "POST",
      headers: authHeaders(),
      body: formData
    });
    const payload = (await response.json().catch(() => null)) as ApiResponse<TData> | null;
    if (!response.ok || !payload?.success) {
      throw new Error(payload?.message ?? `NexSMSID API request failed: ${response.status}`);
    }
    return payload.data;
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
    async changePassword(input: Record<string, unknown>) {
      const response = await request<{ success: boolean }>("/auth/change-password", {
        method: "POST",
        body: JSON.stringify(input)
      });
      return response.data;
    },
    async logoutAll() {
      const response = await request<{ revokedRefreshTokens: number }>("/auth/logout-all", {
        method: "POST"
      });
      return response.data;
    },
    async getLoginHistory(options: { page?: number; limit?: number } = {}) {
      const params = new URLSearchParams();
      if (options.page) params.set("page", String(options.page));
      if (options.limit) params.set("limit", String(options.limit));
      const query = params.toString();
      const response = await request<any>(`/auth/login-history${query ? `?${query}` : ""}`);
      return { items: response.data.items, meta: { total: response.data.total, page: response.data.page, limit: response.data.limit } };
    },
    async users() {
      return request<UserSummary[]>("/users");
    },
    async resetUserPassword(id: string, input: Record<string, unknown>) {
      const response = await request<{ success: boolean }>(`/users/${id}/reset-password`, {
        method: "POST",
        body: JSON.stringify(input)
      });
      return response.data;
    },
    async unlockUser(id: string) {
      const response = await request<{ success: boolean }>(`/users/${id}/unlock`, {
        method: "POST"
      });
      return response.data;
    },
    async forceChangePassword(id: string, input: Record<string, unknown>) {
      const response = await request<{ success: boolean }>(`/users/${id}/force-change-password`, {
        method: "POST",
        body: JSON.stringify(input)
      });
      return response.data;
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
    async dashboardOverview() {
      const response = await request<unknown>("/dashboard/overview");
      return response.data;
    },
    async dashboardAcademicSummary() {
      const response = await request<unknown>("/dashboard/academic-summary");
      return response.data;
    },
    async dashboardFinanceSummary() {
      const response = await request<unknown>("/dashboard/finance-summary");
      return response.data;
    },
    async dashboardPpdbSummary() {
      const response = await request<unknown>("/dashboard/ppdb-summary");
      return response.data;
    },
    async dashboardPeopleSummary() {
      const response = await request<unknown>("/dashboard/people-summary");
      return response.data;
    },
    async dashboardActivityFeed() {
      const response = await request<unknown[]>("/dashboard/activity-feed");
      return response.data;
    },
    async dashboardQuickAlerts() {
      const response = await request<unknown>("/dashboard/quick-alerts");
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
    },

    // Phase 10.2 - Excel Import / Export / Template
    async downloadStudentsTemplate(): Promise<Blob> {
      return downloadFile("/students/template", "students-template.xlsx");
    },
    async exportStudents(): Promise<Blob> {
      return downloadFile("/students/export", "students-export.xlsx");
    },
    async importStudents(file: Blob | File) {
      return uploadFile<ImportResult>("/students/import", file);
    },
    async downloadGuardiansTemplate(): Promise<Blob> {
      return downloadFile("/guardians/template", "guardians-template.xlsx");
    },
    async exportGuardians(): Promise<Blob> {
      return downloadFile("/guardians/export", "guardians-export.xlsx");
    },
    async importGuardians(file: Blob | File) {
      return uploadFile<ImportResult>("/guardians/import", file);
    },
    async downloadTeachersTemplate(): Promise<Blob> {
      return downloadFile("/teachers/template", "teachers-template.xlsx");
    },
    async exportTeachers(): Promise<Blob> {
      return downloadFile("/teachers/export", "teachers-export.xlsx");
    },
    async importTeachers(file: Blob | File) {
      return uploadFile<ImportResult>("/teachers/import", file);
    },
    async downloadStaffsTemplate(): Promise<Blob> {
      return downloadFile("/staffs/template", "staffs-template.xlsx");
    },
    async exportStaffs(): Promise<Blob> {
      return downloadFile("/staffs/export", "staffs-export.xlsx");
    },
    async importStaffs(file: Blob | File) {
      return uploadFile<ImportResult>("/staffs/import", file);
    },
    async downloadSubjectsTemplate(): Promise<Blob> {
      return downloadFile("/subjects/template", "subjects-template.xlsx");
    },
    async exportSubjects(): Promise<Blob> {
      return downloadFile("/subjects/export", "subjects-export.xlsx");
    },
    async importSubjects(file: Blob | File) {
      return uploadFile<ImportResult>("/subjects/import", file);
    },
    async downloadClassroomsTemplate(): Promise<Blob> {
      return downloadFile("/classrooms/template", "classrooms-template.xlsx");
    },
    async exportClassrooms(): Promise<Blob> {
      return downloadFile("/classrooms/export", "classrooms-export.xlsx");
    },
    async importClassrooms(file: Blob | File) {
      return uploadFile<ImportResult>("/classrooms/import", file);
    },
    saveExcelBlob(blob: Blob, filename: string) {
      triggerBrowserDownload(blob, filename);
    },

    // Phase 7 - Teaching Assignments
    async listTeachingAssignments(options: { page?: number; limit?: number; search?: string } = {}) {
      const params = new URLSearchParams();
      if (options.page) params.set("page", String(options.page));
      if (options.limit) params.set("limit", String(options.limit));
      if (options.search) params.set("search", options.search);
      const query = params.toString();
      return request<TeachingAssignmentRecord[]>(`/teaching-assignments${query ? `?${query}` : ""}`);
    },
    async getTeachingAssignment(id: string) {
      const response = await request<TeachingAssignmentRecord>(`/teaching-assignments/${id}`);
      return response.data;
    },
    async createTeachingAssignment(input: Record<string, unknown>) {
      const response = await request<TeachingAssignmentRecord>("/teaching-assignments", { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async updateTeachingAssignment(id: string, input: Record<string, unknown>) {
      const response = await request<TeachingAssignmentRecord>(`/teaching-assignments/${id}`, { method: "PATCH", body: JSON.stringify(input) });
      return response.data;
    },
    async deleteTeachingAssignment(id: string) {
      const response = await request<{ deleted: boolean; id: string }>(`/teaching-assignments/${id}`, { method: "DELETE" });
      return response.data;
    },

    // Phase 7 - Schedules
    async listSchedules(options: { page?: number; limit?: number; search?: string; classroomId?: string; teacherId?: string } = {}) {
      const params = new URLSearchParams();
      if (options.page) params.set("page", String(options.page));
      if (options.limit) params.set("limit", String(options.limit));
      if (options.search) params.set("search", options.search);
      if (options.classroomId) params.set("classroomId", options.classroomId);
      if (options.teacherId) params.set("teacherId", options.teacherId);
      const query = params.toString();
      return request<ScheduleRecord[]>(`/schedules${query ? `?${query}` : ""}`);
    },
    async getSchedule(id: string) {
      const response = await request<ScheduleRecord>(`/schedules/${id}`);
      return response.data;
    },
    async createSchedule(input: Record<string, unknown>) {
      const response = await request<ScheduleRecord>("/schedules", { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async updateSchedule(id: string, input: Record<string, unknown>) {
      const response = await request<ScheduleRecord>(`/schedules/${id}`, { method: "PATCH", body: JSON.stringify(input) });
      return response.data;
    },
    async deleteSchedule(id: string) {
      const response = await request<{ deleted: boolean; id: string }>(`/schedules/${id}`, { method: "DELETE" });
      return response.data;
    },

    // Phase 7 - Attendance
    async listAttendanceSessions(options: { page?: number; limit?: number; search?: string } = {}) {
      const params = new URLSearchParams();
      if (options.page) params.set("page", String(options.page));
      if (options.limit) params.set("limit", String(options.limit));
      if (options.search) params.set("search", options.search);
      const query = params.toString();
      const response = await request<AttendanceSessionRecord[]>(`/attendance/sessions${query ? `?${query}` : ""}`);
      return { items: response.data, meta: response.meta as { total: number; page: number; limit: number } | undefined };
    },
    async createAttendanceSession(input: Record<string, unknown>) {
      const response = await request<AttendanceSessionRecord>("/attendance/sessions", { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async updateAttendanceSession(id: string, input: Record<string, unknown>) {
      const response = await request<AttendanceSessionRecord>(`/attendance/sessions/${id}`, { method: "PATCH", body: JSON.stringify(input) });
      return response.data;
    },
    async recordAttendance(sessionId: string, input: { records: Array<{ studentId: string; status: string; note?: string }> }) {
      const response = await request<AttendanceRecordRecord[]>(`/attendance/sessions/${sessionId}/records`, { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async getAttendanceSession(id: string) {
      const response = await request<AttendanceSessionDetail>(`/attendance/sessions/${id}`);
      return response.data;
    },
    async getAttendanceByClassroom(classroomId: string) {
      const response = await request<AttendanceClassroomSummary>(`/attendance/classrooms/${classroomId}/summary`);
      return response.data;
    },
    async getAttendanceByStudent(studentId: string) {
      const response = await request<AttendanceStudentSummary>(`/attendance/students/${studentId}/summary`);
      return response.data;
    },

    // Phase 7 - Grades
    async listAssessments(options: { page?: number; limit?: number; search?: string } = {}) {
      const params = new URLSearchParams();
      if (options.page) params.set("page", String(options.page));
      if (options.limit) params.set("limit", String(options.limit));
      if (options.search) params.set("search", options.search);
      const query = params.toString();
      const response = await request<AssessmentRecord[]>(`/grades/assessments${query ? `?${query}` : ""}`);
      return { items: response.data, meta: response.meta as { total: number; page: number; limit: number } | undefined };
    },
    async createAssessment(input: Record<string, unknown>) {
      const response = await request<AssessmentRecord>("/grades/assessments", { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async updateAssessment(id: string, input: Record<string, unknown>) {
      const response = await request<AssessmentRecord>(`/grades/assessments/${id}`, { method: "PATCH", body: JSON.stringify(input) });
      return response.data;
    },
    async getAssessmentDetail(id: string) {
      const response = await request<AssessmentDetail>(`/grades/assessments/${id}`);
      return response.data;
    },
    async inputScores(assessmentId: string, input: { scores: Array<{ studentId: string; score: number; notes?: string }> }) {
      const response = await request<GradeRecord[]>(`/grades/assessments/${assessmentId}/scores`, { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async approveScores(assessmentId: string) {
      const response = await request<{ approved: number }>(`/grades/assessments/${assessmentId}/approve`, { method: "POST" });
      return response.data;
    },
    async getGradesByClassroom(classroomId: string) {
      const response = await request<GradesClassroomSummary>(`/grades/classrooms/${classroomId}/summary`);
      return response.data;
    },
    async getGradesByStudent(studentId: string) {
      const response = await request<GradesStudentSummary>(`/grades/students/${studentId}/summary`);
      return response.data;
    },

    // Phase 8 - Finance
    async listInvoices(options: { page?: number; limit?: number; search?: string } = {}) {
      const params = new URLSearchParams();
      if (options.page) params.set("page", String(options.page));
      if (options.limit) params.set("limit", String(options.limit));
      if (options.search) params.set("search", options.search);
      const query = params.toString();
      const response = await request<InvoiceRecord[]>(`/invoices${query ? `?${query}` : ""}`);
      return { items: response.data, meta: response.meta as { total: number; page: number; limit: number } | undefined };
    },
    async getInvoice(id: string) {
      const response = await request<InvoiceRecord>(`/invoices/${id}`);
      return response.data;
    },
    async createInvoice(input: Record<string, unknown>) {
      const response = await request<InvoiceRecord>("/invoices", { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async updateInvoice(id: string, input: Record<string, unknown>) {
      const response = await request<InvoiceRecord>(`/invoices/${id}`, { method: "PATCH", body: JSON.stringify(input) });
      return response.data;
    },
    async deleteInvoice(id: string) {
      const response = await request<{ deleted: boolean; id: string }>(`/invoices/${id}`, { method: "DELETE" });
      return response.data;
    },
    async issueInvoice(id: string) {
      const response = await request<InvoiceRecord>(`/invoices/${id}/issue`, { method: "POST" });
      return response.data;
    },
    async cancelInvoice(id: string) {
      const response = await request<InvoiceRecord>(`/invoices/${id}/cancel`, { method: "POST" });
      return response.data;
    },
    async listPayments(options: { page?: number; limit?: number; search?: string } = {}) {
      const params = new URLSearchParams();
      if (options.page) params.set("page", String(options.page));
      if (options.limit) params.set("limit", String(options.limit));
      if (options.search) params.set("search", options.search);
      const query = params.toString();
      const response = await request<PaymentRecord[]>(`/payments${query ? `?${query}` : ""}`);
      return { items: response.data, meta: response.meta as { total: number; page: number; limit: number } | undefined };
    },
    async getPayment(id: string) {
      const response = await request<PaymentRecord>(`/payments/${id}`);
      return response.data;
    },
    async createPayment(input: Record<string, unknown>) {
      const response = await request<PaymentRecord>("/payments", { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async updatePayment(id: string, input: Record<string, unknown>) {
      const response = await request<PaymentRecord>(`/payments/${id}`, { method: "PATCH", body: JSON.stringify(input) });
      return response.data;
    },
    async verifyPayment(id: string, input: Record<string, unknown> = {}) {
      const response = await request<PaymentRecord>(`/payments/${id}/verify`, { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async rejectPayment(id: string, input: Record<string, unknown>) {
      const response = await request<PaymentRecord>(`/payments/${id}/reject`, { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async cancelPayment(id: string) {
      const response = await request<PaymentRecord>(`/payments/${id}/cancel`, { method: "POST" });
      return response.data;
    },
    async listExpenses(options: { page?: number; limit?: number; search?: string } = {}) {
      const params = new URLSearchParams();
      if (options.page) params.set("page", String(options.page));
      if (options.limit) params.set("limit", String(options.limit));
      if (options.search) params.set("search", options.search);
      const query = params.toString();
      const response = await request<ExpenseRecord[]>(`/expenses${query ? `?${query}` : ""}`);
      return { items: response.data, meta: response.meta as { total: number; page: number; limit: number } | undefined };
    },
    async getExpense(id: string) {
      const response = await request<ExpenseRecord>(`/expenses/${id}`);
      return response.data;
    },
    async createExpense(input: Record<string, unknown>) {
      const response = await request<ExpenseRecord>("/expenses", { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async updateExpense(id: string, input: Record<string, unknown>) {
      const response = await request<ExpenseRecord>(`/expenses/${id}`, { method: "PATCH", body: JSON.stringify(input) });
      return response.data;
    },
    async deleteExpense(id: string) {
      const response = await request<{ deleted: boolean; id: string }>(`/expenses/${id}`, { method: "DELETE" });
      return response.data;
    },
    async approveExpense(id: string) {
      const response = await request<ExpenseRecord>(`/expenses/${id}/approve`, { method: "POST" });
      return response.data;
    },
    async markExpensePaid(id: string) {
      const response = await request<ExpenseRecord>(`/expenses/${id}/mark-paid`, { method: "POST" });
      return response.data;
    },
    async financeSummary() {
      const response = await request<FinanceSummary>("/finance/summary");
      return response.data;
    },
    async financeCashflow() {
      const response = await request<Array<Record<string, unknown>>>("/finance/cashflow");
      return response.data;
    },
    async financeOutstanding() {
      const response = await request<Array<Record<string, unknown>>>("/finance/outstanding");
      return response.data;
    },

    // Phase 8 - PPDB
    async listPpdbPeriods(options: { page?: number; limit?: number; search?: string } = {}) {
      const params = new URLSearchParams();
      if (options.page) params.set("page", String(options.page));
      if (options.limit) params.set("limit", String(options.limit));
      if (options.search) params.set("search", options.search);
      const query = params.toString();
      const response = await request<PpdbPeriodRecord[]>(`/ppdb/periods${query ? `?${query}` : ""}`);
      return { items: response.data, meta: response.meta as { total: number; page: number; limit: number } | undefined };
    },
    async getPpdbPeriod(id: string) {
      const response = await request<PpdbPeriodRecord>(`/ppdb/periods/${id}`);
      return response.data;
    },
    async createPpdbPeriod(input: Record<string, unknown>) {
      const response = await request<PpdbPeriodRecord>("/ppdb/periods", { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async updatePpdbPeriod(id: string, input: Record<string, unknown>) {
      const response = await request<PpdbPeriodRecord>(`/ppdb/periods/${id}`, { method: "PATCH", body: JSON.stringify(input) });
      return response.data;
    },
    async deletePpdbPeriod(id: string) {
      const response = await request<{ deleted: boolean; id: string }>(`/ppdb/periods/${id}`, { method: "DELETE" });
      return response.data;
    },
    async listPpdbRegistrations(options: { page?: number; limit?: number; search?: string } = {}) {
      const params = new URLSearchParams();
      if (options.page) params.set("page", String(options.page));
      if (options.limit) params.set("limit", String(options.limit));
      if (options.search) params.set("search", options.search);
      const query = params.toString();
      const response = await request<PpdbRegistrationRecord[]>(`/ppdb/registrations${query ? `?${query}` : ""}`);
      return { items: response.data, meta: response.meta as { total: number; page: number; limit: number } | undefined };
    },
    async getPpdbRegistration(id: string) {
      const response = await request<PpdbRegistrationRecord>(`/ppdb/registrations/${id}`);
      return response.data;
    },
    async updatePpdbRegistration(id: string, input: Record<string, unknown>) {
      const response = await request<PpdbRegistrationRecord>(`/ppdb/registrations/${id}`, { method: "PATCH", body: JSON.stringify(input) });
      return response.data;
    },
    async verifyPpdbRegistration(id: string) {
      const response = await request<PpdbRegistrationRecord>(`/ppdb/registrations/${id}/verify`, { method: "POST" });
      return response.data;
    },
    async acceptPpdbRegistration(id: string, input: Record<string, unknown> = {}) {
      const response = await request<PpdbRegistrationRecord>(`/ppdb/registrations/${id}/accept`, { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async rejectPpdbRegistration(id: string, input: Record<string, unknown>) {
      const response = await request<PpdbRegistrationRecord>(`/ppdb/registrations/${id}/reject`, { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async convertPpdbRegistration(id: string) {
      const response = await request<PpdbRegistrationRecord>(`/ppdb/registrations/${id}/convert-to-student`, { method: "POST" });
      return response.data;
    },
    async getPpdbSummary() {
      const response = await request<Record<string, unknown>>("/ppdb/summary");
      return response.data;
    },
    async getActivePpdbPeriod() {
      const response = await request<PpdbPeriodRecord>("/public/ppdb/active-period");
      return response.data;
    },
    async publicPpdbRegister(input: Record<string, unknown>) {
      const response = await request<PpdbRegistrationRecord>("/public/ppdb/register", { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },

    // Phase 9 - PKL, Alumni, BKK
    async listIndustryPartners(options: { page?: number; limit?: number; search?: string; status?: string } = {}) {
      const params = new URLSearchParams();
      if (options.page) params.set("page", String(options.page));
      if (options.limit) params.set("limit", String(options.limit));
      if (options.search) params.set("search", options.search);
      if (options.status) params.set("status", options.status);
      const query = params.toString();
      const response = await request<IndustryPartnerRecord[]>(`/industry-partners${query ? `?${query}` : ""}`);
      return { items: response.data, meta: response.meta as { total: number; page: number; limit: number } | undefined };
    },
    async createIndustryPartner(input: Record<string, unknown>) {
      const response = await request<IndustryPartnerRecord>("/industry-partners", { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async updateIndustryPartner(id: string, input: Record<string, unknown>) {
      const response = await request<IndustryPartnerRecord>(`/industry-partners/${id}`, { method: "PATCH", body: JSON.stringify(input) });
      return response.data;
    },
    async deleteIndustryPartner(id: string) {
      const response = await request<{ deleted: boolean; id: string }>(`/industry-partners/${id}`, { method: "DELETE" });
      return response.data;
    },
    async listInternships(options: { page?: number; limit?: number; search?: string; status?: string } = {}) {
      const params = new URLSearchParams();
      if (options.page) params.set("page", String(options.page));
      if (options.limit) params.set("limit", String(options.limit));
      if (options.search) params.set("search", options.search);
      if (options.status) params.set("status", options.status);
      const query = params.toString();
      const response = await request<InternshipRecord[]>(`/internships${query ? `?${query}` : ""}`);
      return { items: response.data, meta: response.meta as { total: number; page: number; limit: number } | undefined };
    },
    async createInternship(input: Record<string, unknown>) {
      const response = await request<InternshipRecord>("/internships", { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async updateInternship(id: string, input: Record<string, unknown>) {
      const response = await request<InternshipRecord>(`/internships/${id}`, { method: "PATCH", body: JSON.stringify(input) });
      return response.data;
    },
    async deleteInternship(id: string) {
      const response = await request<{ deleted: boolean; id: string }>(`/internships/${id}`, { method: "DELETE" });
      return response.data;
    },
    async startInternship(id: string) {
      const response = await request<InternshipRecord>(`/internships/${id}/start`, { method: "POST" });
      return response.data;
    },
    async completeInternship(id: string) {
      const response = await request<InternshipRecord>(`/internships/${id}/complete`, { method: "POST" });
      return response.data;
    },
    async cancelInternship(id: string) {
      const response = await request<InternshipRecord>(`/internships/${id}/cancel`, { method: "POST" });
      return response.data;
    },
    async scoreInternship(id: string, input: Record<string, unknown>) {
      const response = await request<Record<string, unknown>>(`/internships/${id}/score`, { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async listInternshipLogs(internshipId: string, options: { page?: number; limit?: number; search?: string; status?: string } = {}) {
      const params = new URLSearchParams();
      if (options.page) params.set("page", String(options.page));
      if (options.limit) params.set("limit", String(options.limit));
      if (options.search) params.set("search", options.search);
      if (options.status) params.set("status", options.status);
      const query = params.toString();
      const response = await request<InternshipLogRecord[]>(`/internships/${internshipId}/logs${query ? `?${query}` : ""}`);
      return { items: response.data, meta: response.meta as { total: number; page: number; limit: number } | undefined };
    },
    async createInternshipLog(internshipId: string, input: Record<string, unknown>) {
      const response = await request<InternshipLogRecord>(`/internships/${internshipId}/logs`, { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async updateInternshipLog(id: string, input: Record<string, unknown>) {
      const response = await request<InternshipLogRecord>(`/internship-logs/${id}`, { method: "PATCH", body: JSON.stringify(input) });
      return response.data;
    },
    async approveInternshipLog(id: string) {
      const response = await request<InternshipLogRecord>(`/internship-logs/${id}/approve`, { method: "POST" });
      return response.data;
    },
    async rejectInternshipLog(id: string, input: Record<string, unknown>) {
      const response = await request<InternshipLogRecord>(`/internship-logs/${id}/reject`, { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async listAlumni(options: { page?: number; limit?: number; search?: string; status?: string } = {}) {
      const params = new URLSearchParams();
      if (options.page) params.set("page", String(options.page));
      if (options.limit) params.set("limit", String(options.limit));
      if (options.search) params.set("search", options.search);
      if (options.status) params.set("status", options.status);
      const query = params.toString();
      const response = await request<AlumniRecord[]>(`/alumni${query ? `?${query}` : ""}`);
      return { items: response.data, meta: response.meta as { total: number; page: number; limit: number } | undefined };
    },
    async createAlumni(input: Record<string, unknown>) {
      const response = await request<AlumniRecord>("/alumni", { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async updateAlumni(id: string, input: Record<string, unknown>) {
      const response = await request<AlumniRecord>(`/alumni/${id}`, { method: "PATCH", body: JSON.stringify(input) });
      return response.data;
    },
    async deleteAlumni(id: string) {
      const response = await request<{ deleted: boolean; id: string }>(`/alumni/${id}`, { method: "DELETE" });
      return response.data;
    },
    async convertAlumniFromStudent(studentId: string) {
      const response = await request<AlumniRecord>(`/alumni/convert-from-student/${studentId}`, { method: "POST" });
      return response.data;
    },
    async listJobVacancies(options: { page?: number; limit?: number; search?: string; status?: string } = {}) {
      const params = new URLSearchParams();
      if (options.page) params.set("page", String(options.page));
      if (options.limit) params.set("limit", String(options.limit));
      if (options.search) params.set("search", options.search);
      if (options.status) params.set("status", options.status);
      const query = params.toString();
      const response = await request<JobVacancyRecord[]>(`/job-vacancies${query ? `?${query}` : ""}`);
      return { items: response.data, meta: response.meta as { total: number; page: number; limit: number } | undefined };
    },
    async createJobVacancy(input: Record<string, unknown>) {
      const response = await request<JobVacancyRecord>("/job-vacancies", { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async updateJobVacancy(id: string, input: Record<string, unknown>) {
      const response = await request<JobVacancyRecord>(`/job-vacancies/${id}`, { method: "PATCH", body: JSON.stringify(input) });
      return response.data;
    },
    async deleteJobVacancy(id: string) {
      const response = await request<{ deleted: boolean; id: string }>(`/job-vacancies/${id}`, { method: "DELETE" });
      return response.data;
    },
    async publishJobVacancy(id: string) {
      const response = await request<JobVacancyRecord>(`/job-vacancies/${id}/publish`, { method: "POST" });
      return response.data;
    },
    async closeJobVacancy(id: string) {
      const response = await request<JobVacancyRecord>(`/job-vacancies/${id}/close`, { method: "POST" });
      return response.data;
    },
    async publicJobs(options: { page?: number; limit?: number; search?: string } = {}) {
      const params = new URLSearchParams();
      if (options.page) params.set("page", String(options.page));
      if (options.limit) params.set("limit", String(options.limit));
      if (options.search) params.set("search", options.search);
      const query = params.toString();
      const response = await request<JobVacancyRecord[]>(`/public/jobs${query ? `?${query}` : ""}`);
      return { items: response.data, meta: response.meta as { total: number; page: number; limit: number } | undefined };
    },
    async publicJob(id: string) {
      const response = await request<JobVacancyRecord>(`/public/jobs/${id}`);
      return response.data;
    },
    async publicApplyJob(id: string, input: Record<string, unknown>) {
      const response = await request<JobApplicationRecord>(`/public/jobs/${id}/apply`, { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async listJobApplications(options: { page?: number; limit?: number; search?: string; status?: string } = {}) {
      const params = new URLSearchParams();
      if (options.page) params.set("page", String(options.page));
      if (options.limit) params.set("limit", String(options.limit));
      if (options.search) params.set("search", options.search);
      if (options.status) params.set("status", options.status);
      const query = params.toString();
      const response = await request<JobApplicationRecord[]>(`/job-applications${query ? `?${query}` : ""}`);
      return { items: response.data, meta: response.meta as { total: number; page: number; limit: number } | undefined };
    },
    async updateJobApplication(id: string, input: Record<string, unknown>) {
      const response = await request<JobApplicationRecord>(`/job-applications/${id}`, { method: "PATCH", body: JSON.stringify(input) });
      return response.data;
    },
    async reviewJobApplication(id: string) {
      const response = await request<JobApplicationRecord>(`/job-applications/${id}/review`, { method: "POST" });
      return response.data;
    },
    async acceptJobApplication(id: string, input: Record<string, unknown> = {}) {
      const response = await request<JobApplicationRecord>(`/job-applications/${id}/accept`, { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async rejectJobApplication(id: string, input: Record<string, unknown> = {}) {
      const response = await request<JobApplicationRecord>(`/job-applications/${id}/reject`, { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async listTracerStudies(options: { page?: number; limit?: number; search?: string; status?: string } = {}) {
      const params = new URLSearchParams();
      if (options.page) params.set("page", String(options.page));
      if (options.limit) params.set("limit", String(options.limit));
      if (options.search) params.set("search", options.search);
      if (options.status) params.set("status", options.status);
      const query = params.toString();
      const response = await request<TracerStudyRecord[]>(`/tracer-studies${query ? `?${query}` : ""}`);
      return { items: response.data, meta: response.meta as { total: number; page: number; limit: number } | undefined };
    },
    async createTracerStudy(input: Record<string, unknown>) {
      const response = await request<TracerStudyRecord>("/tracer-studies", { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async updateTracerStudy(id: string, input: Record<string, unknown>) {
      const response = await request<TracerStudyRecord>(`/tracer-studies/${id}`, { method: "PATCH", body: JSON.stringify(input) });
      return response.data;
    },
    async deleteTracerStudy(id: string) {
      const response = await request<{ deleted: boolean; id: string }>(`/tracer-studies/${id}`, { method: "DELETE" });
      return response.data;
    },
    async getBkkSummary() {
      const response = await request<BkkSummary>("/bkk/summary");
      return response.data;
    },
    async getBkkJobStatusChart() {
      const response = await request<Array<Record<string, unknown>>>("/bkk/job-status-chart");
      return response.data;
    },
    async getBkkAlumniStatusChart() {
      const response = await request<Array<Record<string, unknown>>>("/bkk/alumni-status-chart");
      return response.data;
    },

    // Phase 12.1 - Counseling and Discipline
    async listCounselingCases(options: { page?: number; limit?: number; search?: string; studentId?: string; status?: string; priority?: string; category?: string; counselorId?: string; startDate?: string; endDate?: string } = {}) {
      const response = await request<CounselingCaseRecord[]>(`/counseling/cases${buildQuery(options)}`);
      return { items: response.data, meta: response.meta as { total: number; page: number; limit: number } | undefined };
    },
    async createCounselingCase(input: Record<string, unknown>) {
      const response = await request<CounselingCaseRecord>("/counseling/cases", { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async getCounselingCase(id: string) {
      const response = await request<CounselingCaseRecord>(`/counseling/cases/${id}`);
      return response.data;
    },
    async updateCounselingCase(id: string, input: Record<string, unknown>) {
      const response = await request<CounselingCaseRecord>(`/counseling/cases/${id}`, { method: "PATCH", body: JSON.stringify(input) });
      return response.data;
    },
    async deleteCounselingCase(id: string) {
      const response = await request<{ deleted: boolean; id: string }>(`/counseling/cases/${id}`, { method: "DELETE" });
      return response.data;
    },
    async closeCounselingCase(id: string, input: Record<string, unknown> = {}) {
      const response = await request<CounselingCaseRecord>(`/counseling/cases/${id}/close`, { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async reopenCounselingCase(id: string) {
      const response = await request<CounselingCaseRecord>(`/counseling/cases/${id}/reopen`, { method: "POST" });
      return response.data;
    },
    async listCounselingNotes(caseId: string) {
      const response = await request<CounselingNoteRecord[]>(`/counseling/cases/${caseId}/notes`);
      return response.data;
    },
    async createCounselingNote(caseId: string, input: Record<string, unknown>) {
      const response = await request<CounselingNoteRecord>(`/counseling/cases/${caseId}/notes`, { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async listDisciplineRules(options: { page?: number; limit?: number; search?: string; severity?: string; isActive?: boolean } = {}) {
      const response = await request<DisciplineRuleRecord[]>(`/discipline/rules${buildQuery(options)}`);
      return { items: response.data, meta: response.meta as { total: number; page: number; limit: number } | undefined };
    },
    async createDisciplineRule(input: Record<string, unknown>) {
      const response = await request<DisciplineRuleRecord>("/discipline/rules", { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async updateDisciplineRule(id: string, input: Record<string, unknown>) {
      const response = await request<DisciplineRuleRecord>(`/discipline/rules/${id}`, { method: "PATCH", body: JSON.stringify(input) });
      return response.data;
    },
    async deleteDisciplineRule(id: string) {
      const response = await request<{ deleted: boolean; id: string }>(`/discipline/rules/${id}`, { method: "DELETE" });
      return response.data;
    },
    async listDisciplineViolations(options: { page?: number; limit?: number; search?: string; studentId?: string; classroomId?: string; ruleId?: string; status?: string; severity?: string; startDate?: string; endDate?: string } = {}) {
      const response = await request<DisciplineViolationRecord[]>(`/discipline/violations${buildQuery(options)}`);
      return { items: response.data, meta: response.meta as { total: number; page: number; limit: number } | undefined };
    },
    async createDisciplineViolation(input: Record<string, unknown>) {
      const response = await request<DisciplineViolationRecord>("/discipline/violations", { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async getDisciplineViolation(id: string) {
      const response = await request<DisciplineViolationRecord>(`/discipline/violations/${id}`);
      return response.data;
    },
    async updateDisciplineViolation(id: string, input: Record<string, unknown>) {
      const response = await request<DisciplineViolationRecord>(`/discipline/violations/${id}`, { method: "PATCH", body: JSON.stringify(input) });
      return response.data;
    },
    async confirmDisciplineViolation(id: string) {
      const response = await request<DisciplineViolationRecord>(`/discipline/violations/${id}/confirm`, { method: "POST" });
      return response.data;
    },
    async cancelDisciplineViolation(id: string) {
      const response = await request<DisciplineViolationRecord>(`/discipline/violations/${id}/cancel`, { method: "POST" });
      return response.data;
    },
    async deleteDisciplineViolation(id: string) {
      const response = await request<{ deleted: boolean; id: string }>(`/discipline/violations/${id}`, { method: "DELETE" });
      return response.data;
    },
    async listStudentAchievements(options: { page?: number; limit?: number; search?: string; studentId?: string; classroomId?: string; category?: string; startDate?: string; endDate?: string } = {}) {
      const response = await request<StudentAchievementRecord[]>(`/discipline/achievements${buildQuery(options)}`);
      return { items: response.data, meta: response.meta as { total: number; page: number; limit: number } | undefined };
    },
    async createStudentAchievement(input: Record<string, unknown>) {
      const response = await request<StudentAchievementRecord>("/discipline/achievements", { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async updateStudentAchievement(id: string, input: Record<string, unknown>) {
      const response = await request<StudentAchievementRecord>(`/discipline/achievements/${id}`, { method: "PATCH", body: JSON.stringify(input) });
      return response.data;
    },
    async deleteStudentAchievement(id: string) {
      const response = await request<{ deleted: boolean; id: string }>(`/discipline/achievements/${id}`, { method: "DELETE" });
      return response.data;
    },
    async getStudentDisciplineSummary(studentId: string) {
      const response = await request<DisciplineSummaryRecord>(`/discipline/students/${studentId}/summary`);
      return response.data;
    },
    async getClassroomDisciplineSummary(classroomId: string) {
      const response = await request<DisciplineSummaryRecord>(`/discipline/classrooms/${classroomId}/summary`);
      return response.data;
    },
    async downloadDisciplineViolationPdf(id: string): Promise<Blob> {
      return downloadFile(`/discipline/violations/${id}/print`, `discipline-violation-${id}.pdf`);
    },
    async downloadStudentDisciplineSummaryPdf(studentId: string): Promise<Blob> {
      return downloadFile(`/discipline/students/${studentId}/summary.pdf`, `discipline-summary-${studentId}.pdf`);
    },

    // Phase 12.2 - Letter Management
    async listLetterTemplates(options: { page?: number; limit?: number; search?: string; category?: string; status?: string } = {}) {
      const response = await request<LetterTemplateRecord[]>(`/letters/templates${buildQuery(options)}`);
      return { items: response.data, meta: response.meta as { total: number; page: number; limit: number } | undefined };
    },
    async createLetterTemplate(input: Record<string, unknown>) {
      const response = await request<LetterTemplateRecord>("/letters/templates", { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async getLetterTemplate(id: string) {
      const response = await request<LetterTemplateRecord>(`/letters/templates/${id}`);
      return response.data;
    },
    async updateLetterTemplate(id: string, input: Record<string, unknown>) {
      const response = await request<LetterTemplateRecord>(`/letters/templates/${id}`, { method: "PATCH", body: JSON.stringify(input) });
      return response.data;
    },
    async deleteLetterTemplate(id: string) {
      const response = await request<{ deleted: boolean; item: LetterTemplateRecord }>(`/letters/templates/${id}`, { method: "DELETE" });
      return response.data;
    },
    async listLetters(options: { page?: number; limit?: number; search?: string; status?: string; direction?: string; priority?: string; category?: string; recipientType?: string; studentId?: string; guardianId?: string; teacherId?: string; staffId?: string; createdById?: string; startDate?: string; endDate?: string } = {}) {
      const response = await request<LetterRecord[]>(`/letters${buildQuery(options)}`);
      return { items: response.data, meta: response.meta as { total: number; page: number; limit: number } | undefined };
    },
    async createLetter(input: Record<string, unknown>) {
      const response = await request<LetterRecord>("/letters", { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async getLetter(id: string) {
      const response = await request<LetterRecord>(`/letters/${id}`);
      return response.data;
    },
    async updateLetter(id: string, input: Record<string, unknown>) {
      const response = await request<LetterRecord>(`/letters/${id}`, { method: "PATCH", body: JSON.stringify(input) });
      return response.data;
    },
    async deleteLetter(id: string) {
      const response = await request<{ deleted: boolean; item: LetterRecord }>(`/letters/${id}`, { method: "DELETE" });
      return response.data;
    },
    async submitLetter(id: string) {
      const response = await request<LetterRecord>(`/letters/${id}/submit`, { method: "POST" });
      return response.data;
    },
    async approveLetter(id: string) {
      const response = await request<LetterRecord>(`/letters/${id}/approve`, { method: "POST" });
      return response.data;
    },
    async rejectLetter(id: string, input: Record<string, unknown>) {
      const response = await request<LetterRecord>(`/letters/${id}/reject`, { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async issueLetter(id: string) {
      const response = await request<LetterRecord>(`/letters/${id}/issue`, { method: "POST" });
      return response.data;
    },
    async archiveLetter(id: string) {
      const response = await request<LetterRecord>(`/letters/${id}/archive`, { method: "POST" });
      return response.data;
    },
    async cancelLetter(id: string) {
      const response = await request<LetterRecord>(`/letters/${id}/cancel`, { method: "POST" });
      return response.data;
    },
    async reopenLetter(id: string) {
      const response = await request<LetterRecord>(`/letters/${id}/reopen`, { method: "POST" });
      return response.data;
    },
    async generateLetterNumber(id: string) {
      const response = await request<LetterRecord>(`/letters/${id}/generate-number`, { method: "POST" });
      return response.data;
    },
    async getLetterNumberPreview(options: { category: string; date?: string }) {
      const response = await request<Record<string, unknown>>(`/letters/number-preview${buildQuery(options)}`);
      return response.data;
    },
    async getLetterSummary() {
      const response = await request<LetterSummaryRecord>("/letters/summary");
      return response.data;
    },
    async downloadLetterPdf(id: string): Promise<Blob> {
      return downloadFile(`/letters/${id}/pdf`, `letter-${id}.pdf`);
    },

    // Phase 10 - Communication, Notifications, Reports
    async listAnnouncements(options: { page?: number; limit?: number; search?: string; status?: string; audience?: string } = {}) {
      const params = new URLSearchParams();
      if (options.page) params.set("page", String(options.page));
      if (options.limit) params.set("limit", String(options.limit));
      if (options.search) params.set("search", options.search);
      if (options.status) params.set("status", options.status);
      if (options.audience) params.set("audience", options.audience);
      const query = params.toString();
      const response = await request<AnnouncementRecord[]>(`/announcements${query ? `?${query}` : ""}`);
      return { items: response.data, meta: response.meta as { total: number; page: number; limit: number } | undefined };
    },
    async createAnnouncement(input: Record<string, unknown>) {
      const response = await request<AnnouncementRecord>("/announcements", { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async updateAnnouncement(id: string, input: Record<string, unknown>) {
      const response = await request<AnnouncementRecord>(`/announcements/${id}`, { method: "PATCH", body: JSON.stringify(input) });
      return response.data;
    },
    async deleteAnnouncement(id: string) {
      const response = await request<{ deleted: boolean; id: string }>(`/announcements/${id}`, { method: "DELETE" });
      return response.data;
    },
    async publishAnnouncement(id: string) {
      const response = await request<AnnouncementRecord>(`/announcements/${id}/publish`, { method: "POST" });
      return response.data;
    },
    async archiveAnnouncement(id: string) {
      const response = await request<AnnouncementRecord>(`/announcements/${id}/archive`, { method: "POST" });
      return response.data;
    },
    async publicAnnouncements(options: { page?: number; limit?: number; search?: string; audience?: string } = {}) {
      const params = new URLSearchParams();
      if (options.page) params.set("page", String(options.page));
      if (options.limit) params.set("limit", String(options.limit));
      if (options.search) params.set("search", options.search);
      if (options.audience) params.set("audience", options.audience);
      const query = params.toString();
      const response = await request<AnnouncementRecord[]>(`/public/announcements${query ? `?${query}` : ""}`);
      return { items: response.data, meta: response.meta as { total: number; page: number; limit: number } | undefined };
    },
    async publicAnnouncement(id: string) {
      const response = await request<AnnouncementRecord>(`/public/announcements/${id}`);
      return response.data;
    },
    async inboxMessages(options: { page?: number; limit?: number; search?: string; status?: string } = {}) {
      const params = new URLSearchParams();
      if (options.page) params.set("page", String(options.page));
      if (options.limit) params.set("limit", String(options.limit));
      if (options.search) params.set("search", options.search);
      if (options.status) params.set("status", options.status);
      const query = params.toString();
      const response = await request<InternalMessageRecord[]>(`/internal-messages/inbox${query ? `?${query}` : ""}`);
      return { items: response.data, meta: response.meta as { total: number; page: number; limit: number } | undefined };
    },
    async sentMessages(options: { page?: number; limit?: number; search?: string; status?: string } = {}) {
      const params = new URLSearchParams();
      if (options.page) params.set("page", String(options.page));
      if (options.limit) params.set("limit", String(options.limit));
      if (options.search) params.set("search", options.search);
      if (options.status) params.set("status", options.status);
      const query = params.toString();
      const response = await request<InternalMessageRecord[]>(`/internal-messages/sent${query ? `?${query}` : ""}`);
      return { items: response.data, meta: response.meta as { total: number; page: number; limit: number } | undefined };
    },
    async sendMessage(input: Record<string, unknown>) {
      const response = await request<InternalMessageRecord>("/internal-messages", { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async markMessageRead(id: string) {
      const response = await request<InternalMessageRecord>(`/internal-messages/${id}/read`, { method: "POST" });
      return response.data;
    },
    async deleteMessage(id: string) {
      const response = await request<{ deleted: boolean; id: string }>(`/internal-messages/${id}`, { method: "DELETE" });
      return response.data;
    },
    async listNotifications(options: { page?: number; limit?: number; search?: string; status?: string; channel?: string } = {}) {
      const params = new URLSearchParams();
      if (options.page) params.set("page", String(options.page));
      if (options.limit) params.set("limit", String(options.limit));
      if (options.search) params.set("search", options.search);
      if (options.status) params.set("status", options.status);
      if (options.channel) params.set("channel", options.channel);
      const query = params.toString();
      const response = await request<NotificationRecord[]>(`/notifications${query ? `?${query}` : ""}`);
      return { items: response.data, meta: response.meta as { total: number; page: number; limit: number } | undefined };
    },
    async unreadNotificationCount() {
      const response = await request<{ total: number }>("/notifications/unread-count");
      return response.data;
    },
    async createNotification(input: Record<string, unknown>) {
      const response = await request<NotificationRecord>("/notifications", { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async markNotificationRead(id: string) {
      const response = await request<NotificationRecord>(`/notifications/${id}/read`, { method: "POST" });
      return response.data;
    },
    async markAllNotificationsRead() {
      const response = await request<{ updated: number }>("/notifications/read-all", { method: "POST" });
      return response.data;
    },
    async archiveNotification(id: string) {
      const response = await request<NotificationRecord>(`/notifications/${id}/archive`, { method: "POST" });
      return response.data;
    },
    async listNotificationTemplates(options: { page?: number; limit?: number; search?: string; channel?: string } = {}) {
      const params = new URLSearchParams();
      if (options.page) params.set("page", String(options.page));
      if (options.limit) params.set("limit", String(options.limit));
      if (options.search) params.set("search", options.search);
      if (options.channel) params.set("channel", options.channel);
      const query = params.toString();
      const response = await request<NotificationTemplateRecord[]>(`/notification-templates${query ? `?${query}` : ""}`);
      return { items: response.data, meta: response.meta as { total: number; page: number; limit: number } | undefined };
    },
    async createNotificationTemplate(input: Record<string, unknown>) {
      const response = await request<NotificationTemplateRecord>("/notification-templates", { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async updateNotificationTemplate(id: string, input: Record<string, unknown>) {
      const response = await request<NotificationTemplateRecord>(`/notification-templates/${id}`, { method: "PATCH", body: JSON.stringify(input) });
      return response.data;
    },
    async deleteNotificationTemplate(id: string) {
      const response = await request<{ deleted: boolean; id: string }>(`/notification-templates/${id}`, { method: "DELETE" });
      return response.data;
    },
    async listReportTypes() {
      const response = await request<any[]>("/reports/types");
      return response.data;
    },
    async getReportSummary() {
      const response = await request<ReportCenterSummary>("/reports/summary");
      return response.data;
    },
    async generateReport(input: Record<string, unknown>) {
      const response = await request<ReportJobRecord>("/reports/generate", { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async downloadReport(reportJobId: string): Promise<Blob> {
      return downloadFile(`/reports/download/${reportJobId}`, `report-${reportJobId}.xlsx`);
    },
    async listReportJobs(options: { page?: number; limit?: number; search?: string; status?: string; type?: string } = {}) {
      const params = new URLSearchParams();
      if (options.page) params.set("page", String(options.page));
      if (options.limit) params.set("limit", String(options.limit));
      if (options.search) params.set("search", options.search);
      if (options.status) params.set("status", options.status);
      if (options.type) params.set("type", options.type);
      const query = params.toString();
      const response = await request<ReportJobRecord[]>(`/report-jobs${query ? `?${query}` : ""}`);
      return { items: response.data, meta: response.meta as { total: number; page: number; limit: number } | undefined };
    },
    async createReportJob(input: Record<string, unknown>) {
      const response = await request<ReportJobRecord>("/report-jobs", { method: "POST", body: JSON.stringify(input) });
      return response.data;
    },
    async cancelReportJob(id: string) {
      const response = await request<ReportJobRecord>(`/report-jobs/${id}/cancel`, { method: "POST" });
      return response.data;
    },
    async listExportHistory(options: { page?: number; limit?: number; search?: string; entity?: string; format?: string } = {}) {
      const params = new URLSearchParams();
      if (options.page) params.set("page", String(options.page));
      if (options.limit) params.set("limit", String(options.limit));
      if (options.search) params.set("search", options.search);
      if (options.entity) params.set("entity", options.entity);
      if (options.format) params.set("format", options.format);
      const query = params.toString();
      const response = await request<ExportHistoryRecord[]>(`/export-history${query ? `?${query}` : ""}`);
      return { items: response.data, meta: response.meta as { total: number; page: number; limit: number } | undefined };
    },
    async downloadInvoicePdf(id: string): Promise<Blob> {
      return downloadFile(`/invoices/${id}/pdf`, `invoice-${id}.pdf`);
    },
    async downloadPaymentReceiptPdf(id: string): Promise<Blob> {
      return downloadFile(`/payments/${id}/receipt.pdf`, `receipt-${id}.pdf`);
    },
    async downloadPpdbProofPdf(id: string): Promise<Blob> {
      return downloadFile(`/ppdb/registrations/${id}/proof.pdf`, `ppdb-${id}.pdf`);
    },
    async downloadAttendanceRecapPdf(classroomId: string, input: { startDate: string; endDate: string }): Promise<Blob> {
      const params = new URLSearchParams();
      params.set("startDate", input.startDate);
      params.set("endDate", input.endDate);
      return downloadFile(`/attendance/classrooms/${classroomId}/recap.pdf?${params.toString()}`, `attendance-recap-${classroomId}.pdf`);
    },
    async downloadGradeRecapPdf(classroomId: string, input: { semesterId?: string } = {}): Promise<Blob> {
      const params = new URLSearchParams();
      if (input.semesterId) params.set("semesterId", input.semesterId);
      const query = params.toString();
      return downloadFile(`/grades/classrooms/${classroomId}/recap.pdf${query ? `?${query}` : ""}`, `grade-recap-${classroomId}.pdf`);
    },
    savePdfBlob(blob: Blob, filename: string) {
      triggerBrowserDownload(blob, filename);
    },

    // Phase 10.4 - Role-based Portals
    async getTeacherPortalSummary() {
      const response = await request<unknown>("/teacher-portal/summary");
      return response.data;
    },
    async getTeacherPortalTeachingAssignments() {
      const response = await request<unknown[]>("/teacher-portal/teaching-assignments");
      return response.data;
    },
    async getTeacherPortalSchedules() {
      const response = await request<unknown[]>("/teacher-portal/schedules");
      return response.data;
    },
    async getTeacherPortalAttendanceSessions(options: { limit?: number } = {}) {
      const params = new URLSearchParams();
      if (options.limit) params.set("limit", String(options.limit));
      const query = params.toString();
      const response = await request<unknown[]>(`/teacher-portal/attendance-sessions${query ? `?${query}` : ""}`);
      return response.data;
    },
    async getTeacherPortalAssessments() {
      const response = await request<unknown[]>("/teacher-portal/assessments");
      return response.data;
    },
    async getTeacherPortalNotifications(options: { limit?: number } = {}) {
      const params = new URLSearchParams();
      if (options.limit) params.set("limit", String(options.limit));
      const query = params.toString();
      const response = await request<unknown[]>(`/teacher-portal/notifications${query ? `?${query}` : ""}`);
      return response.data;
    },
    async getTeacherPortalDashboard() {
      const response = await request<unknown>("/teacher-portal/dashboard");
      return response.data;
    },
    async getTeacherPortalTodaySchedules() {
      const response = await request<unknown[]>("/teacher-portal/today-schedules");
      return response.data;
    },
    async getTeacherPortalPendingAttendance() {
      const response = await request<unknown[]>("/teacher-portal/pending-attendance");
      return response.data;
    },
    async getTeacherPortalPendingGrades() {
      const response = await request<unknown[]>("/teacher-portal/pending-grades");
      return response.data;
    },
    async getTeacherPortalRecentNotifications() {
      const response = await request<unknown[]>("/teacher-portal/recent-notifications");
      return response.data;
    },

    async getStudentPortalSummary() {
      const response = await request<unknown>("/student-portal/summary");
      return response.data;
    },
    async getStudentPortalProfile() {
      const response = await request<unknown>("/student-portal/profile");
      return response.data;
    },
    async getStudentPortalSchedules() {
      const response = await request<unknown[]>("/student-portal/schedules");
      return response.data;
    },
    async getStudentPortalAttendance(options: { limit?: number } = {}) {
      const params = new URLSearchParams();
      if (options.limit) params.set("limit", String(options.limit));
      const query = params.toString();
      const response = await request<unknown>(`/student-portal/attendance${query ? `?${query}` : ""}`);
      return response.data;
    },
    async getStudentPortalGrades() {
      const response = await request<unknown[]>("/student-portal/grades");
      return response.data;
    },
    async getStudentPortalInvoices() {
      const response = await request<unknown[]>("/student-portal/invoices");
      return response.data;
    },
    async getStudentPortalDiscipline() {
      const response = await request<unknown>("/student-portal/discipline");
      return response.data;
    },
    async getStudentPortalAnnouncements(options: { limit?: number } = {}) {
      const params = new URLSearchParams();
      if (options.limit) params.set("limit", String(options.limit));
      const query = params.toString();
      const response = await request<unknown[]>(`/student-portal/announcements${query ? `?${query}` : ""}`);
      return response.data;
    },
    async getStudentPortalNotifications(options: { limit?: number } = {}) {
      const params = new URLSearchParams();
      if (options.limit) params.set("limit", String(options.limit));
      const query = params.toString();
      const response = await request<unknown[]>(`/student-portal/notifications${query ? `?${query}` : ""}`);
      return response.data;
    },
    async getStudentPortalDashboard() {
      const response = await request<unknown>("/student-portal/dashboard");
      return response.data;
    },
    async getStudentPortalTodaySchedules() {
      const response = await request<unknown[]>("/student-portal/today-schedules");
      return response.data;
    },
    async getStudentPortalAttendanceSummary() {
      const response = await request<unknown>("/student-portal/attendance-summary");
      return response.data;
    },
    async getStudentPortalGradeSummary() {
      const response = await request<unknown>("/student-portal/grade-summary");
      return response.data;
    },
    async getStudentPortalInvoiceSummary() {
      const response = await request<unknown>("/student-portal/invoice-summary");
      return response.data;
    },
    async getStudentPortalRecentAnnouncements() {
      const response = await request<unknown[]>("/student-portal/recent-announcements");
      return response.data;
    },

    async getGuardianPortalSummary() {
      const response = await request<unknown>("/guardian-portal/summary");
      return response.data;
    },
    async getGuardianPortalChildren() {
      const response = await request<unknown[]>("/guardian-portal/children");
      return response.data;
    },
    async getGuardianPortalChildAttendance(studentId: string, options: { limit?: number } = {}) {
      const params = new URLSearchParams();
      if (options.limit) params.set("limit", String(options.limit));
      const query = params.toString();
      const response = await request<unknown>(`/guardian-portal/children/${studentId}/attendance${query ? `?${query}` : ""}`);
      return response.data;
    },
    async getGuardianPortalChildGrades(studentId: string) {
      const response = await request<unknown[]>(`/guardian-portal/children/${studentId}/grades`);
      return response.data;
    },
    async getGuardianPortalChildInvoices(studentId: string) {
      const response = await request<unknown[]>(`/guardian-portal/children/${studentId}/invoices`);
      return response.data;
    },
    async getGuardianPortalChildDiscipline(studentId: string) {
      const response = await request<unknown>(`/guardian-portal/children/${studentId}/discipline`);
      return response.data;
    },
    async getGuardianPortalAnnouncements(options: { limit?: number } = {}) {
      const params = new URLSearchParams();
      if (options.limit) params.set("limit", String(options.limit));
      const query = params.toString();
      const response = await request<unknown[]>(`/guardian-portal/announcements${query ? `?${query}` : ""}`);
      return response.data;
    },
    async getGuardianPortalNotifications(options: { limit?: number } = {}) {
      const params = new URLSearchParams();
      if (options.limit) params.set("limit", String(options.limit));
      const query = params.toString();
      const response = await request<unknown[]>(`/guardian-portal/notifications${query ? `?${query}` : ""}`);
      return response.data;
    },
    async getGuardianPortalDashboard() {
      const response = await request<unknown>("/guardian-portal/dashboard");
      return response.data;
    },
    async getGuardianPortalChildDashboard(studentId: string) {
      const response = await request<unknown>(`/guardian-portal/children/${studentId}/dashboard`);
      return response.data;
    },
    async getGuardianPortalChildAttendanceSummary(studentId: string) {
      const response = await request<unknown>(`/guardian-portal/children/${studentId}/attendance-summary`);
      return response.data;
    },
    async getGuardianPortalChildGradeSummary(studentId: string) {
      const response = await request<unknown>(`/guardian-portal/children/${studentId}/grade-summary`);
      return response.data;
    },
    async getGuardianPortalChildInvoiceSummary(studentId: string) {
      const response = await request<unknown>(`/guardian-portal/children/${studentId}/invoice-summary`);
      return response.data;
    },
    async getGuardianPortalRecentAnnouncements() {
      const response = await request<unknown[]>("/guardian-portal/recent-announcements");
      return response.data;
    },

    // Inventory
    async getInventoryCategories() {
      const response = await request<any[]>("/inventory/categories");
      return response.data;
    },
    async createInventoryCategory(data: Record<string, any>) {
      const response = await request<any>("/inventory/categories", { method: "POST", body: JSON.stringify(data) });
      return response.data;
    },
    async getInventoryLocations() {
      const response = await request<any[]>("/inventory/locations");
      return response.data;
    },
    async createInventoryLocation(data: Record<string, any>) {
      const response = await request<any>("/inventory/locations", { method: "POST", body: JSON.stringify(data) });
      return response.data;
    },
    async getInventoryItems(query?: Record<string, any>) {
      const qs = query ? new URLSearchParams(query as any).toString() : "";
      const response = await request<any>(`/inventory/items${qs ? "?" + qs : ""}`);
      return response.data;
    },
    async getInventoryItem(id: string) {
      const response = await request<any>(`/inventory/items/${id}`);
      return response.data;
    },
    async createInventoryItem(data: Record<string, any>) {
      const response = await request<any>("/inventory/items", { method: "POST", body: JSON.stringify(data) });
      return response.data;
    },
    async updateInventoryItem(id: string, data: Record<string, any>) {
      const response = await request<any>(`/inventory/items/${id}`, { method: "PATCH", body: JSON.stringify(data) });
      return response.data;
    },
    async deleteInventoryItem(id: string) {
      const response = await request<any>(`/inventory/items/${id}`, { method: "DELETE" });
      return response.data;
    },
    async getInventoryMovements(query?: Record<string, any>) {
      const qs = query ? new URLSearchParams(query as any).toString() : "";
      const response = await request<any>(`/inventory/movements${qs ? "?" + qs : ""}`);
      return response.data;
    },
    async createInventoryMovement(data: Record<string, any>) {
      const response = await request<any>("/inventory/movements", { method: "POST", body: JSON.stringify(data) });
      return response.data;
    },
    async getInventoryMaintenances(query?: Record<string, any>) {
      const qs = query ? new URLSearchParams(query as any).toString() : "";
      const response = await request<any>(`/inventory/maintenances${qs ? "?" + qs : ""}`);
      return response.data;
    },
    async createInventoryMaintenance(data: Record<string, any>) {
      const response = await request<any>("/inventory/maintenances", { method: "POST", body: JSON.stringify(data) });
      return response.data;
    },
    async getInventoryLoans(query?: Record<string, any>) {
      const qs = query ? new URLSearchParams(query as any).toString() : "";
      const response = await request<any>(`/inventory/loans${qs ? "?" + qs : ""}`);
      return response.data;
    },
    async createInventoryLoan(data: Record<string, any>) {
      const response = await request<any>("/inventory/loans", { method: "POST", body: JSON.stringify(data) });
      return response.data;
    },
    async approveInventoryLoan(id: string) {
      const response = await request<any>(`/inventory/loans/${id}/approve`, { method: "POST" });
      return response.data;
    },
    async returnInventoryLoan(id: string) {
      const response = await request<any>(`/inventory/loans/${id}/return`, { method: "POST" });
      return response.data;
    },
    async getInventorySummary() {
      const response = await request<any>("/inventory/summary");
      return response.data;
    },
    async getInventoryLowStock() {
      return request<any>("/inventory/reports/low-stock");
    },
    async getInventoryMaintenanceDue() {
      return request<any>("/inventory/reports/maintenance-due");
    },
    async getInventoryLoansOverdue() {
      return request<any>("/inventory/reports/loans-overdue");
    },

    async updateInventoryMaintenance(id: string, data: Record<string, any>) {
      const response = await request<any>(`/inventory/maintenances/${id}`, { method: "PATCH", body: JSON.stringify(data) });
      return response.data;
    },
    async startInventoryMaintenance(id: string) {
      const response = await request<any>(`/inventory/maintenances/${id}/start`, { method: "POST" });
      return response.data;
    },
    async completeInventoryMaintenance(id: string) {
      const response = await request<any>(`/inventory/maintenances/${id}/complete`, { method: "POST" });
      return response.data;
    },
    async cancelInventoryMaintenance(id: string) {
      const response = await request<any>(`/inventory/maintenances/${id}/cancel`, { method: "POST" });
      return response.data;
    },
    async deleteInventoryMaintenance(id: string) {
      const response = await request<any>(`/inventory/maintenances/${id}`, { method: "DELETE" });
      return response.data;
    },
    async updateInventoryLoan(id: string, data: Record<string, any>) {
      const response = await request<any>(`/inventory/loans/${id}`, { method: "PATCH", body: JSON.stringify(data) });
      return response.data;
    },
    async rejectInventoryLoan(id: string) {
      const response = await request<any>(`/inventory/loans/${id}/reject`, { method: "POST" });
      return response.data;
    },
    async cancelInventoryLoan(id: string) {
      const response = await request<any>(`/inventory/loans/${id}/cancel`, { method: "POST" });
      return response.data;
    },
    async markInventoryLoanBorrowed(id: string) {
      const response = await request<any>(`/inventory/loans/${id}/borrowed`, { method: "POST" });
      return response.data;
    },
    async deleteInventoryLoan(id: string) {
      const response = await request<any>(`/inventory/loans/${id}`, { method: "DELETE" });
      return response.data;
    },
    async downloadInventoryItemPdf(id: string) {
      const blob = await downloadFile(`/inventory/items/${id}/print`, `item-${id}.pdf`);
      triggerBrowserDownload(blob, `item-${id}.pdf`);
    },
    async downloadInventoryLoanPdf(id: string) {
      const blob = await downloadFile(`/inventory/loans/${id}/print`, `loan-${id}.pdf`);
      triggerBrowserDownload(blob, `loan-${id}.pdf`);
    },
    async downloadInventorySummaryPdf() {
      const blob = await downloadFile("/inventory/summary.pdf", "inventory-summary.pdf");
      triggerBrowserDownload(blob, "inventory-summary.pdf");
    },

    // =========================================================================
    // LIBRARY MANAGEMENT
    // =========================================================================

    // Categories
    async listLibraryCategories(params?: any) {
      const response = await request<any>(`/library/categories?${new URLSearchParams(params as any).toString()}`);
      return response.data;
    },
    async createLibraryCategory(data: any) {
      const response = await request<any>("/library/categories", { method: "POST", body: JSON.stringify(data) });
      return response.data;
    },
    async getLibraryCategory(id: string) {
      const response = await request<any>(`/library/categories/${id}`);
      return response.data;
    },
    async updateLibraryCategory(id: string, data: any) {
      const response = await request<any>(`/library/categories/${id}`, { method: "PATCH", body: JSON.stringify(data) });
      return response.data;
    },
    async deleteLibraryCategory(id: string) {
      const response = await request<any>(`/library/categories/${id}`, { method: "DELETE" });
      return response.data;
    },

    // Shelves
    async listLibraryShelves(params?: any) {
      const response = await request<any>(`/library/shelves?${new URLSearchParams(params as any).toString()}`);
      return response.data;
    },
    async createLibraryShelf(data: any) {
      const response = await request<any>("/library/shelves", { method: "POST", body: JSON.stringify(data) });
      return response.data;
    },
    async getLibraryShelf(id: string) {
      const response = await request<any>(`/library/shelves/${id}`);
      return response.data;
    },
    async updateLibraryShelf(id: string, data: any) {
      const response = await request<any>(`/library/shelves/${id}`, { method: "PATCH", body: JSON.stringify(data) });
      return response.data;
    },
    async deleteLibraryShelf(id: string) {
      const response = await request<any>(`/library/shelves/${id}`, { method: "DELETE" });
      return response.data;
    },

    // Books
    async listLibraryBooks(params?: any) {
      const response = await request<any>(`/library/books?${new URLSearchParams(params as any).toString()}`);
      return response.data;
    },
    async createLibraryBook(data: any) {
      const response = await request<any>("/library/books", { method: "POST", body: JSON.stringify(data) });
      return response.data;
    },
    async getLibraryBook(id: string) {
      const response = await request<any>(`/library/books/${id}`);
      return response.data;
    },
    async updateLibraryBook(id: string, data: any) {
      const response = await request<any>(`/library/books/${id}`, { method: "PATCH", body: JSON.stringify(data) });
      return response.data;
    },
    async deleteLibraryBook(id: string) {
      const response = await request<any>(`/library/books/${id}`, { method: "DELETE" });
      return response.data;
    },

    // Copies
    async listLibraryBookCopies(bookId: string, params?: any) {
      const response = await request<any>(`/library/books/${bookId}/copies?${new URLSearchParams(params as any).toString()}`);
      return response.data;
    },
    async createLibraryBookCopy(bookId: string, data: any) {
      const response = await request<any>(`/library/books/${bookId}/copies`, { method: "POST", body: JSON.stringify(data) });
      return response.data;
    },
    async getLibraryCopy(id: string) {
      const response = await request<any>(`/library/copies/${id}`);
      return response.data;
    },
    async updateLibraryCopy(id: string, data: any) {
      const response = await request<any>(`/library/copies/${id}`, { method: "PATCH", body: JSON.stringify(data) });
      return response.data;
    },
    async deleteLibraryCopy(id: string) {
      const response = await request<any>(`/library/copies/${id}`, { method: "DELETE" });
      return response.data;
    },

    // Members
    async listLibraryMembers(params?: any) {
      const response = await request<any>(`/library/members?${new URLSearchParams(params as any).toString()}`);
      return response.data;
    },
    async createLibraryMember(data: any) {
      const response = await request<any>("/library/members", { method: "POST", body: JSON.stringify(data) });
      return response.data;
    },
    async getLibraryMember(id: string) {
      const response = await request<any>(`/library/members/${id}`);
      return response.data;
    },
    async updateLibraryMember(id: string, data: any) {
      const response = await request<any>(`/library/members/${id}`, { method: "PATCH", body: JSON.stringify(data) });
      return response.data;
    },
    async deleteLibraryMember(id: string) {
      const response = await request<any>(`/library/members/${id}`, { method: "DELETE" });
      return response.data;
    },

    // Loans
    async listLibraryLoans(params?: any) {
      const response = await request<any>(`/library/loans?${new URLSearchParams(params as any).toString()}`);
      return response.data;
    },
    async createLibraryLoan(data: any) {
      const response = await request<any>("/library/loans", { method: "POST", body: JSON.stringify(data) });
      return response.data;
    },
    async getLibraryLoan(id: string) {
      const response = await request<any>(`/library/loans/${id}`);
      return response.data;
    },
    async updateLibraryLoan(id: string, data: any) {
      const response = await request<any>(`/library/loans/${id}`, { method: "PATCH", body: JSON.stringify(data) });
      return response.data;
    },
    async returnLibraryLoan(id: string, data: any) {
      const response = await request<any>(`/library/loans/${id}/return`, { method: "POST", body: JSON.stringify(data) });
      return response.data;
    },
    async markLibraryLoanLost(id: string, data: any) {
      const response = await request<any>(`/library/loans/${id}/mark-lost`, { method: "POST", body: JSON.stringify(data) });
      return response.data;
    },
    async cancelLibraryLoan(id: string) {
      const response = await request<any>(`/library/loans/${id}/cancel`, { method: "POST" });
      return response.data;
    },
    async deleteLibraryLoan(id: string) {
      const response = await request<any>(`/library/loans/${id}`, { method: "DELETE" });
      return response.data;
    },

    // Reservations
    async listLibraryReservations(params?: any) {
      const response = await request<any>(`/library/reservations?${new URLSearchParams(params as any).toString()}`);
      return response.data;
    },
    async createLibraryReservation(data: any) {
      const response = await request<any>("/library/reservations", { method: "POST", body: JSON.stringify(data) });
      return response.data;
    },
    async getLibraryReservation(id: string) {
      const response = await request<any>(`/library/reservations/${id}`);
      return response.data;
    },
    async markLibraryReservationReady(id: string) {
      const response = await request<any>(`/library/reservations/${id}/mark-ready`, { method: "POST" });
      return response.data;
    },
    async cancelLibraryReservation(id: string) {
      const response = await request<any>(`/library/reservations/${id}/cancel`, { method: "POST" });
      return response.data;
    },
    async expireLibraryReservation(id: string) {
      const response = await request<any>(`/library/reservations/${id}/expire`, { method: "POST" });
      return response.data;
    },

    // Fines
    async listLibraryFines(params?: any) {
      const response = await request<any>(`/library/fines?${new URLSearchParams(params as any).toString()}`);
      return response.data;
    },
    async getLibraryFine(id: string) {
      const response = await request<any>(`/library/fines/${id}`);
      return response.data;
    },
    async payLibraryFine(id: string, data: any) {
      const response = await request<any>(`/library/fines/${id}/pay`, { method: "POST", body: JSON.stringify(data) });
      return response.data;
    },
    async waiveLibraryFine(id: string, data: any) {
      const response = await request<any>(`/library/fines/${id}/waive`, { method: "POST", body: JSON.stringify(data) });
      return response.data;
    },
    async cancelLibraryFine(id: string) {
      const response = await request<any>(`/library/fines/${id}/cancel`, { method: "POST" });
      return response.data;
    },

    // Summary & PDFs
    async getLibrarySummary() {
      const response = await request<any>("/library/summary");
      return response.data;
    },
    async getLibraryOverdue() {
      const response = await request<any>("/library/overdue");
      return response.data;
    },
    async getLibraryAvailableBooks() {
      const response = await request<any>("/library/available-books");
      return response.data;
    },
    async getLibraryPopularBooks() {
      const response = await request<any>("/library/popular-books");
      return response.data;
    },
    async downloadLibraryBookPdf(id: string) {
      const blob = await downloadFile(`/library/books/${id}/print`, `book-${id}.pdf`);
      triggerBrowserDownload(blob, `book-${id}.pdf`);
    },
    async downloadLibraryCopyLabelPdf(id: string) {
      const blob = await downloadFile(`/library/copies/${id}/label`, `label-${id}.pdf`);
      triggerBrowserDownload(blob, `label-${id}.pdf`);
    },
    async downloadLibraryLoanReceiptPdf(id: string) {
      const blob = await downloadFile(`/library/loans/${id}/receipt`, `receipt-${id}.pdf`);
      triggerBrowserDownload(blob, `receipt-${id}.pdf`);
    },
    async downloadLibraryMemberCardPdf(id: string) {
      const blob = await downloadFile(`/library/members/${id}/card`, `member-card-${id}.pdf`);
      triggerBrowserDownload(blob, `member-card-${id}.pdf`);
    },
    async downloadLibrarySummaryPdf() {
      const blob = await downloadFile("/library/summary.pdf", "library-summary.pdf");
      triggerBrowserDownload(blob, "library-summary.pdf");
    },

    // HR & PAYROLL
    async getHRSummary() {
      const response = await request<any>("/hr/summary");
      return response.data;
    },
    async listHRPositions(params?: any) {
      const qs = new URLSearchParams(params).toString();
      const response = await request<any>(`/hr/positions?${qs}`);
      return normalizeListResponse(response);
    },
    async getHRPosition(id: string) {
      const response = await request<any>(`/hr/positions/${id}`);
      return response.data;
    },
    async createHRPosition(data: any) {
      const response = await request<any>("/hr/positions", { method: "POST", body: JSON.stringify(data) });
      return response.data;
    },
    async updateHRPosition(id: string, data: any) {
      const response = await request<any>(`/hr/positions/${id}`, { method: "PATCH", body: JSON.stringify(data) });
      return response.data;
    },
    async deleteHRPosition(id: string) {
      const response = await request<any>(`/hr/positions/${id}`, { method: "DELETE" });
      return response.data;
    },
    async listEmployees(params?: any) {
      const qs = new URLSearchParams(params).toString();
      const response = await request<any>(`/hr/employees?${qs}`);
      return normalizeListResponse(response);
    },
    async getEmployee(id: string) {
      const response = await request<any>(`/hr/employees/${id}`);
      return response.data;
    },
    async createEmployee(data: any) {
      const response = await request<any>("/hr/employees", { method: "POST", body: JSON.stringify(data) });
      return response.data;
    },
    async updateEmployee(id: string, data: any) {
      const response = await request<any>(`/hr/employees/${id}`, { method: "PATCH", body: JSON.stringify(data) });
      return response.data;
    },
    async deleteEmployee(id: string) {
      const response = await request<any>(`/hr/employees/${id}`, { method: "DELETE" });
      return response.data;
    },
    async listEmployeeAttendance(params?: any) {
      const qs = new URLSearchParams(params).toString();
      const response = await request<any>(`/hr/attendance?${qs}`);
      return normalizeListResponse(response);
    },
    async createEmployeeAttendance(data: any) {
      const response = await request<any>("/hr/attendance", { method: "POST", body: JSON.stringify(data) });
      return response.data;
    },
    async updateEmployeeAttendance(id: string, data: any) {
      const response = await request<any>(`/hr/attendance/${id}`, { method: "PATCH", body: JSON.stringify(data) });
      return response.data;
    },
    async deleteEmployeeAttendance(id: string) {
      const response = await request<any>(`/hr/attendance/${id}`, { method: "DELETE" });
      return response.data;
    },
    async listLeaveRequests(params?: any) {
      const qs = new URLSearchParams(params).toString();
      const response = await request<any>(`/hr/leaves?${qs}`);
      return normalizeListResponse(response);
    },
    async getLeaveRequest(id: string) {
      const response = await request<any>(`/hr/leaves/${id}`);
      return response.data;
    },
    async createLeaveRequest(data: any) {
      const response = await request<any>("/hr/leaves", { method: "POST", body: JSON.stringify(data) });
      return response.data;
    },
    async updateLeaveRequest(id: string, data: any) {
      const response = await request<any>(`/hr/leaves/${id}`, { method: "PATCH", body: JSON.stringify(data) });
      return response.data;
    },
    async approveLeaveRequest(id: string) {
      const response = await request<any>(`/hr/leaves/${id}/approve`, { method: "POST" });
      return response.data;
    },
    async rejectLeaveRequest(id: string, data: any) {
      const response = await request<any>(`/hr/leaves/${id}/reject`, { method: "POST", body: JSON.stringify(data) });
      return response.data;
    },
    async cancelLeaveRequest(id: string) {
      const response = await request<any>(`/hr/leaves/${id}/cancel`, { method: "POST" });
      return response.data;
    },
    async deleteLeaveRequest(id: string) {
      const response = await request<any>(`/hr/leaves/${id}`, { method: "DELETE" });
      return response.data;
    },
    
    async getPayrollSummary() {
      const response = await request<any>("/payroll/summary");
      return response.data;
    },
    async listPayrollComponents(params?: any) {
      const qs = new URLSearchParams(params).toString();
      const response = await request<any>(`/payroll/components?${qs}`);
      return normalizeListResponse(response);
    },
    async getPayrollComponent(id: string) {
      const response = await request<any>(`/payroll/components/${id}`);
      return response.data;
    },
    async createPayrollComponent(data: any) {
      const response = await request<any>("/payroll/components", { method: "POST", body: JSON.stringify(data) });
      return response.data;
    },
    async updatePayrollComponent(id: string, data: any) {
      const response = await request<any>(`/payroll/components/${id}`, { method: "PATCH", body: JSON.stringify(data) });
      return response.data;
    },
    async deletePayrollComponent(id: string) {
      const response = await request<any>(`/payroll/components/${id}`, { method: "DELETE" });
      return response.data;
    },
    async listEmployeeComponents(employeeId: string) {
      const response = await request<any>(`/payroll/employees/${employeeId}/components`);
      return response.data;
    },
    async createEmployeeSalaryComponent(data: any) {
      const response = await request<any>("/payroll/employee-components", { method: "POST", body: JSON.stringify(data) });
      return response.data;
    },
    async updateEmployeeSalaryComponent(id: string, data: any) {
      const response = await request<any>(`/payroll/employee-components/${id}`, { method: "PATCH", body: JSON.stringify(data) });
      return response.data;
    },
    async deleteEmployeeSalaryComponent(id: string) {
      const response = await request<any>(`/payroll/employee-components/${id}`, { method: "DELETE" });
      return response.data;
    },
    async listPayrollPeriods(params?: any) {
      const qs = new URLSearchParams(params).toString();
      const response = await request<any>(`/payroll/periods?${qs}`);
      return normalizeListResponse(response);
    },
    async getPayrollPeriod(id: string) {
      const response = await request<any>(`/payroll/periods/${id}`);
      return response.data;
    },
    async createPayrollPeriod(data: any) {
      const response = await request<any>("/payroll/periods", { method: "POST", body: JSON.stringify(data) });
      return response.data;
    },
    async updatePayrollPeriod(id: string, data: any) {
      const response = await request<any>(`/payroll/periods/${id}`, { method: "PATCH", body: JSON.stringify(data) });
      return response.data;
    },
    async deletePayrollPeriod(id: string) {
      const response = await request<any>(`/payroll/periods/${id}`, { method: "DELETE" });
      return response.data;
    },
    async openPayrollPeriod(id: string) {
      const response = await request<any>(`/payroll/periods/${id}/open`, { method: "POST" });
      return response.data;
    },
    async calculatePayrollPeriod(id: string) {
      const response = await request<any>(`/payroll/periods/${id}/calculate`, { method: "POST" });
      return response.data;
    },
    async approvePayrollPeriod(id: string) {
      const response = await request<any>(`/payroll/periods/${id}/approve`, { method: "POST" });
      return response.data;
    },
    async payPayrollPeriod(id: string) {
      const response = await request<any>(`/payroll/periods/${id}/pay`, { method: "POST" });
      return response.data;
    },
    async closePayrollPeriod(id: string) {
      const response = await request<any>(`/payroll/periods/${id}/close`, { method: "POST" });
      return response.data;
    },
    async cancelPayrollPeriod(id: string) {
      const response = await request<any>(`/payroll/periods/${id}/cancel`, { method: "POST" });
      return response.data;
    },
    async listPayrollRuns(params?: any) {
      const qs = new URLSearchParams(params).toString();
      const response = await request<any>(`/payroll/runs?${qs}`);
      return normalizeListResponse(response);
    },
    async getPayrollRun(id: string) {
      const response = await request<any>(`/payroll/runs/${id}`);
      return response.data;
    },
    async updatePayrollRun(id: string, data: any) {
      const response = await request<any>(`/payroll/runs/${id}`, { method: "PATCH", body: JSON.stringify(data) });
      return response.data;
    },
    async listPayslips(params?: any) {
      const qs = new URLSearchParams(params).toString();
      const response = await request<any>(`/payroll/payslips?${qs}`);
      return normalizeListResponse(response);
    },
    async listPayrollPayments(params?: any) {
      const qs = new URLSearchParams(params).toString();
      const response = await request<any>(`/payroll/payments?${qs}`);
      return normalizeListResponse(response);
    },
    async getPayslip(id: string) {
      const response = await request<any>(`/payroll/payslips/${id}`);
      return response.data;
    },
    async markPayslipPaid(id: string, data: any) {
      const response = await request<any>(`/payroll/payslips/${id}/mark-paid`, { method: "POST", body: JSON.stringify(data) });
      return response.data;
    },
    async downloadPayslipPdf(id: string) {
      const blob = await downloadFile(`/payroll/payslips/${id}/pdf`, `payslip-${id}.pdf`);
      triggerBrowserDownload(blob, `payslip-${id}.pdf`);
    },

    // ── Exam / CBT Management ──────────────────────────────────────
    async listExamTypes(params?: any) {
      const qs = new URLSearchParams(params).toString();
      const response = await request<any>(`/exams/types?${qs}`);
      return normalizeListResponse(response);
    },
    async getExamType(id: string) {
      const response = await request<any>(`/exams/types/${id}`);
      return response.data;
    },
    async createExamType(data: any) {
      const response = await request<any>("/exams/types", { method: "POST", body: JSON.stringify(data) });
      return response.data;
    },
    async updateExamType(id: string, data: any) {
      const response = await request<any>(`/exams/types/${id}`, { method: "PATCH", body: JSON.stringify(data) });
      return response.data;
    },
    async deleteExamType(id: string) {
      const response = await request<any>(`/exams/types/${id}`, { method: "DELETE" });
      return response.data;
    },

    async listExamRooms(params?: any) {
      const qs = new URLSearchParams(params).toString();
      const response = await request<any>(`/exams/rooms?${qs}`);
      return normalizeListResponse(response);
    },
    async getExamRoom(id: string) {
      const response = await request<any>(`/exams/rooms/${id}`);
      return response.data;
    },
    async createExamRoom(data: any) {
      const response = await request<any>("/exams/rooms", { method: "POST", body: JSON.stringify(data) });
      return response.data;
    },
    async updateExamRoom(id: string, data: any) {
      const response = await request<any>(`/exams/rooms/${id}`, { method: "PATCH", body: JSON.stringify(data) });
      return response.data;
    },
    async deleteExamRoom(id: string) {
      const response = await request<any>(`/exams/rooms/${id}`, { method: "DELETE" });
      return response.data;
    },

    async listExams(params?: any) {
      const qs = new URLSearchParams(params).toString();
      const response = await request<any>(`/exams?${qs}`);
      return normalizeListResponse(response);
    },
    async getExam(id: string) {
      const response = await request<any>(`/exams/${id}`);
      return response.data;
    },
    async createExam(data: any) {
      const response = await request<any>("/exams", { method: "POST", body: JSON.stringify(data) });
      return response.data;
    },
    async updateExam(id: string, data: any) {
      const response = await request<any>(`/exams/${id}`, { method: "PATCH", body: JSON.stringify(data) });
      return response.data;
    },
    async deleteExam(id: string) {
      const response = await request<any>(`/exams/${id}`, { method: "DELETE" });
      return response.data;
    },
    async updateExamStatus(id: string, status: string) {
      const response = await request<any>(`/exams/${id}/status`, { method: "POST", body: JSON.stringify({ status }) });
      return response.data;
    },
    async getExamSummary() {
      const response = await request<any>("/exams/summary");
      return response.data;
    },

    async listExamParticipants(examId: string, params?: any) {
      const qs = new URLSearchParams(params).toString();
      const response = await request<any>(`/exams/${examId}/participants?${qs}`);
      return normalizeListResponse(response);
    },
    async addExamParticipant(examId: string, studentId: string) {
      const response = await request<any>(`/exams/${examId}/participants`, { method: "POST", body: JSON.stringify({ studentId }) });
      return response.data;
    },
    async addExamParticipantsBulk(examId: string, studentIds: string[]) {
      const response = await request<any>(`/exams/${examId}/participants/bulk`, { method: "POST", body: JSON.stringify({ studentIds }) });
      return response.data;
    },
    async removeExamParticipant(examId: string, participantId: string) {
      const response = await request<any>(`/exams/${examId}/participants/${participantId}`, { method: "DELETE" });
      return response.data;
    },
    async updateExamParticipantStatus(examId: string, participantId: string, status: string) {
      const response = await request<any>(`/exams/${examId}/participants/${participantId}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      return response.data;
    },

    async listExamSchedules(examId: string) {
      const response = await request<any>(`/exams/${examId}/schedules`);
      return response.data;
    },
    async createExamSchedule(examId: string, data: any) {
      const response = await request<any>(`/exams/${examId}/schedules`, { method: "POST", body: JSON.stringify(data) });
      return response.data;
    },
    async updateExamSchedule(scheduleId: string, data: any) {
      const response = await request<any>(`/exams/schedules/${scheduleId}`, { method: "PATCH", body: JSON.stringify(data) });
      return response.data;
    },
    async deleteExamSchedule(scheduleId: string) {
      const response = await request<any>(`/exams/schedules/${scheduleId}`, { method: "DELETE" });
      return response.data;
    },

    async listExamSessions(scheduleId: string) {
      const response = await request<any>(`/exams/schedules/${scheduleId}/sessions`);
      return response.data;
    },
    async createExamSession(scheduleId: string, data: any) {
      const response = await request<any>(`/exams/schedules/${scheduleId}/sessions`, { method: "POST", body: JSON.stringify(data) });
      return response.data;
    },
    async updateExamSessionStatus(sessionId: string, status: string) {
      const response = await request<any>(`/exams/sessions/${sessionId}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      return response.data;
    },

    async listExamQuestions(examId: string) {
      const response = await request<any>(`/exams/${examId}/questions`);
      return response.data;
    },
    async addExamQuestion(examId: string, data: any) {
      const response = await request<any>(`/exams/${examId}/questions`, { method: "POST", body: JSON.stringify(data) });
      return response.data;
    },
    async updateExamQuestion(questionId: string, data: any) {
      const response = await request<any>(`/exams/questions/${questionId}`, { method: "PATCH", body: JSON.stringify(data) });
      return response.data;
    },
    async deleteExamQuestion(questionId: string) {
      const response = await request<any>(`/exams/questions/${questionId}`, { method: "DELETE" });
      return response.data;
    },

    async listExamBanks(params?: any) {
      const qs = new URLSearchParams(params).toString();
      const response = await request<any>(`/exams/banks?${qs}`);
      return normalizeListResponse(response);
    },
    async createExamBank(data: any) {
      const response = await request<any>("/exams/banks", { method: "POST", body: JSON.stringify(data) });
      return response.data;
    },

    async listExamResults(examId: string, params?: any) {
      const qs = new URLSearchParams(params).toString();
      const response = await request<any>(`/exams/${examId}/results?${qs}`);
      return normalizeListResponse(response);
    },

    async downloadExamCardPdf(examId: string) {
      const blob = await downloadFile(`/exams/${examId}/print-card`, `exam-card-${examId}.pdf`);
      triggerBrowserDownload(blob, `exam-card-${examId}.pdf`);
    },
    async downloadExamParticipantCardPdf(examId: string, participantId: string) {
      const blob = await downloadFile(`/exams/${examId}/print-card-participant/${participantId}`, `exam-participant-card-${participantId}.pdf`);
      triggerBrowserDownload(blob, `exam-participant-card-${participantId}.pdf`);
    },
    async downloadExamReport(examId: string, format: string = "xlsx") {
      return downloadFile(`/exams/${examId}/report?format=${format}`, `exam-report-${examId}.${format}`);
    }
  };
}
