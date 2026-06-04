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
    }
  };
}
