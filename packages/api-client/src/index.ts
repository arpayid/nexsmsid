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

export type ApiClientOptions = {
  accessToken?: string | (() => string | null | undefined);
  baseUrl?: string;
  fetcher?: typeof fetch;
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
    async getReportSummary() {
      const response = await request<ReportCenterSummary>("/reports/summary");
      return response.data;
    },
    async generateReport(input: Record<string, unknown>) {
      const response = await request<ReportJobRecord>("/reports/generate", { method: "POST", body: JSON.stringify(input) });
      return response.data;
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
    }
  };
}
