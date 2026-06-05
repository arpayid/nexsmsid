import { Inject, Injectable } from "@nestjs/common";

import { AuthenticatedUser, RequestMeta } from "../auth/auth.types";
import { NotificationDispatchService } from "./notification-dispatch.service";
import { NotificationRecipientResolverService } from "./notification-recipient-resolver.service";

type EventActor = Pick<AuthenticatedUser, "id"> | string | null | undefined;

@Injectable()
export class NotificationEventService {
  constructor(
    @Inject(NotificationDispatchService) private readonly dispatch: NotificationDispatchService,
    @Inject(NotificationRecipientResolverService) private readonly recipients: NotificationRecipientResolverService
  ) {}

  async announcementPublished(announcement: { audience: string; content: string; id: string; title: string }, actor: EventActor, meta: RequestMeta = {}) {
    const userIds = await this.recipients.announcementAudienceUsers(announcement.audience);
    return this.dispatch.notifyUsers(
      userIds,
      {
        action: "published",
        body: trimBody(announcement.content),
        dedupeKey: `announcement:${announcement.id}:published`,
        entityId: announcement.id,
        entityType: "announcement",
        title: `Pengumuman: ${announcement.title}`,
        type: "announcement.published",
        url: "/announcements"
      },
      {
        ...meta,
        action: "notification.dispatch.announcement",
        actorId: actorId(actor),
        entity: "announcement",
        entityId: announcement.id,
        metadata: { audience: announcement.audience }
      }
    );
  }

  async invoiceIssued(invoice: { id: string; invoiceNumber: string; studentId: string; total: unknown }, actor: EventActor, meta: RequestMeta = {}) {
    const userIds = await this.studentAndGuardianUsers(invoice.studentId);
    return this.dispatch.notifyUsers(userIds, {
      action: "issued",
      body: `Tagihan ${invoice.invoiceNumber} diterbitkan dengan total ${formatCurrency(invoice.total)}.`,
      dedupeKey: `invoice:${invoice.id}:issued`,
      entityId: invoice.id,
      entityType: "invoice",
      title: "Tagihan baru diterbitkan",
      type: "invoice.issued",
      url: "/student/invoices"
    }, {
      ...meta,
      action: "notification.dispatch.invoice",
      actorId: actorId(actor),
      entity: "invoice",
      entityId: invoice.id,
      metadata: { invoiceNumber: invoice.invoiceNumber, studentId: invoice.studentId }
    });
  }

  async paymentStatusChanged(payment: { amount: unknown; id: string; invoice: { id: string; invoiceNumber: string; studentId: string }; paymentNumber: string; status: string }, actor: EventActor, meta: RequestMeta = {}) {
    const userIds = await this.studentAndGuardianUsers(payment.invoice.studentId);
    const accepted = payment.status === "VERIFIED";
    return this.dispatch.notifyUsers(userIds, {
      action: payment.status.toLowerCase(),
      body: `Pembayaran ${payment.paymentNumber} untuk invoice ${payment.invoice.invoiceNumber} ${accepted ? "terverifikasi" : "ditolak"}.`,
      dedupeKey: `payment:${payment.id}:${payment.status}`,
      entityId: payment.id,
      entityType: "payment",
      title: accepted ? "Pembayaran terverifikasi" : "Pembayaran ditolak",
      type: accepted ? "payment.verified" : "payment.rejected",
      url: "/student/invoices"
    }, {
      ...meta,
      action: "notification.dispatch.payment",
      actorId: actorId(actor),
      entity: "payment",
      entityId: payment.id,
      metadata: { invoiceId: payment.invoice.id, paymentNumber: payment.paymentNumber, status: payment.status }
    });
  }

  async attendanceFlagged(record: { id: string; sessionId: string; status: string; studentId: string }, context: { date: Date; subject?: string | null }, actor: EventActor, meta: RequestMeta = {}) {
    if (!["ABSENT", "LATE", "SICK", "PERMIT"].includes(record.status)) return { requested: 0, recipients: 0, created: 0, skipped: 0 };
    const userIds = await this.recipients.guardiansOfStudent(record.studentId);
    return this.dispatch.notifyUsers(userIds, {
      action: record.status.toLowerCase(),
      body: `Presensi ${context.subject ?? "pelajaran"} tanggal ${context.date.toLocaleDateString("id-ID")} tercatat ${attendanceLabel(record.status)}.`,
      dedupeKey: `attendance:${record.id}:${record.status}`,
      entityId: record.id,
      entityType: "attendance_record",
      title: `Presensi anak: ${attendanceLabel(record.status)}`,
      type: "attendance.flagged",
      url: "/guardian/attendance"
    }, {
      ...meta,
      action: "notification.dispatch.attendance",
      actorId: actorId(actor),
      entity: "attendance_record",
      entityId: record.id,
      metadata: { sessionId: record.sessionId, status: record.status, studentId: record.studentId }
    });
  }

  async gradePublished(grade: { assessmentName: string; id: string; score: number; status: string; studentId: string; subject?: string | null }, actor: EventActor, meta: RequestMeta = {}) {
    const userIds = await this.recipients.studentUser(grade.studentId);
    return this.dispatch.notifyUsers(userIds, {
      action: grade.status.toLowerCase(),
      body: `Nilai ${grade.subject ?? "pelajaran"} untuk ${grade.assessmentName} sudah ${grade.status === "APPROVED" ? "disetujui" : "dipublikasikan"}.`,
      dedupeKey: `grade:${grade.id}:${grade.status}`,
      entityId: grade.id,
      entityType: "grade",
      title: "Nilai terbaru tersedia",
      type: grade.status === "APPROVED" ? "grade.approved" : "grade.published",
      url: "/student/grades"
    }, {
      ...meta,
      action: "notification.dispatch.grade",
      actorId: actorId(actor),
      entity: "grade",
      entityId: grade.id,
      metadata: { score: grade.score, status: grade.status, studentId: grade.studentId }
    });
  }

  async ppdbStatusChanged(registration: { id: string; name: string; registrationNumber: string; status: string }, actor: EventActor, meta: RequestMeta = {}) {
    const userIds = await this.recipients.ppdbConvertedStudentUser(registration.id);
    return this.dispatch.notifyUsers(userIds, {
      action: registration.status.toLowerCase(),
      body: `Status PPDB ${registration.registrationNumber} untuk ${registration.name}: ${registration.status}.`,
      dedupeKey: `ppdb:${registration.id}:${registration.status}`,
      entityId: registration.id,
      entityType: "ppdb_registration",
      title: `Update PPDB: ${registration.status}`,
      type: "ppdb.status-changed",
      url: "/admin/ppdb/registrations"
    }, {
      ...meta,
      action: "notification.dispatch.ppdb",
      actorId: actorId(actor),
      entity: "ppdb_registration",
      entityId: registration.id,
      metadata: { registrationNumber: registration.registrationNumber, status: registration.status }
    });
  }

  async internshipLogReviewed(log: { activity: string; id: string; internship: { studentId: string }; status: string }, actor: EventActor, meta: RequestMeta = {}) {
    const userIds = await this.recipients.studentUser(log.internship.studentId);
    return this.dispatch.notifyUsers(userIds, {
      action: log.status.toLowerCase(),
      body: `Jurnal PKL "${log.activity}" ${log.status === "APPROVED" ? "disetujui" : "ditolak"}.`,
      dedupeKey: `internship-log:${log.id}:${log.status}`,
      entityId: log.id,
      entityType: "internship_log",
      title: `Jurnal PKL ${log.status === "APPROVED" ? "disetujui" : "ditolak"}`,
      type: log.status === "APPROVED" ? "internship-log.approved" : "internship-log.rejected",
      url: "/student"
    }, {
      ...meta,
      action: "notification.dispatch.internship",
      actorId: actorId(actor),
      entity: "internship_log",
      entityId: log.id,
      metadata: { status: log.status, studentId: log.internship.studentId }
    });
  }

  async jobApplicationStatusChanged(application: { applicantName: string; id: string; jobVacancy?: { title: string } | null; status: string }, actor: EventActor, meta: RequestMeta = {}) {
    const userIds = await this.recipients.jobApplicationUser(application.id);
    return this.dispatch.notifyUsers(userIds, {
      action: application.status.toLowerCase(),
      body: `Lamaran ${application.jobVacancy?.title ?? "pekerjaan"} untuk ${application.applicantName} berstatus ${application.status}.`,
      dedupeKey: `job-application:${application.id}:${application.status}`,
      entityId: application.id,
      entityType: "job_application",
      title: `Lamaran kerja ${application.status}`,
      type: "job-application.status-changed",
      url: "/jobs"
    }, {
      ...meta,
      action: "notification.dispatch.job-application",
      actorId: actorId(actor),
      entity: "job_application",
      entityId: application.id,
      metadata: { status: application.status }
    });
  }

  async disciplineViolationConfirmed(violation: { id: string; point: number; rule: { code: string; name: string; severity: string }; studentId: string }, actor: EventActor, meta: RequestMeta = {}) {
    const [studentUsers, guardianUsers] = await Promise.all([
      this.recipients.studentUser(violation.studentId),
      this.recipients.guardiansOfStudent(violation.studentId)
    ]);
    const basePayload = {
      action: "confirmed",
      body: `Pelanggaran ${violation.rule.code} - ${violation.rule.name} telah dikonfirmasi dengan ${violation.point} poin.`,
      entityId: violation.id,
      entityType: "DisciplineViolation",
      metadata: { point: violation.point, severity: violation.rule.severity, studentId: violation.studentId },
      title: "Pelanggaran kedisiplinan dikonfirmasi",
      type: "DISCIPLINE_VIOLATION_CONFIRMED"
    };
    const studentResult = await this.dispatch.notifyUsers(studentUsers, {
      ...basePayload,
      dedupeKey: `discipline-violation:${violation.id}:student`,
      url: "/student/discipline"
    }, {
      ...meta,
      action: "notification.dispatch.discipline-violation",
      actorId: actorId(actor),
      entity: "DisciplineViolation",
      entityId: violation.id,
      metadata: { studentId: violation.studentId, audience: "student" }
    });
    const guardianResult = await this.dispatch.notifyUsers(guardianUsers, {
      ...basePayload,
      dedupeKey: `discipline-violation:${violation.id}:guardian`,
      url: "/guardian/discipline"
    }, {
      ...meta,
      action: "notification.dispatch.discipline-violation",
      actorId: actorId(actor),
      entity: "DisciplineViolation",
      entityId: violation.id,
      metadata: { studentId: violation.studentId, audience: "guardian" }
    });
    return combineDispatchResults(studentResult, guardianResult);
  }

  async studentAchievementCreated(achievement: { category: string; id: string; point: number; studentId: string; title: string }, actor: EventActor, meta: RequestMeta = {}) {
    const [studentUsers, guardianUsers] = await Promise.all([
      this.recipients.studentUser(achievement.studentId),
      this.recipients.guardiansOfStudent(achievement.studentId)
    ]);
    const basePayload = {
      action: "created",
      body: `Prestasi ${achievement.title} dicatat dengan ${achievement.point} poin.`,
      entityId: achievement.id,
      entityType: "StudentAchievement",
      metadata: { category: achievement.category, point: achievement.point, studentId: achievement.studentId },
      title: "Prestasi siswa dicatat",
      type: "STUDENT_ACHIEVEMENT_CREATED"
    };
    const studentResult = await this.dispatch.notifyUsers(studentUsers, {
      ...basePayload,
      dedupeKey: `student-achievement:${achievement.id}:student`,
      url: "/student/discipline"
    }, {
      ...meta,
      action: "notification.dispatch.student-achievement",
      actorId: actorId(actor),
      entity: "StudentAchievement",
      entityId: achievement.id,
      metadata: { studentId: achievement.studentId, audience: "student" }
    });
    const guardianResult = await this.dispatch.notifyUsers(guardianUsers, {
      ...basePayload,
      dedupeKey: `student-achievement:${achievement.id}:guardian`,
      url: "/guardian/discipline"
    }, {
      ...meta,
      action: "notification.dispatch.student-achievement",
      actorId: actorId(actor),
      entity: "StudentAchievement",
      entityId: achievement.id,
      metadata: { studentId: achievement.studentId, audience: "guardian" }
    });
    return combineDispatchResults(studentResult, guardianResult);
  }

  async counselingFollowUp(counselingCase: { counselorId?: string | null; createdById: string; followUpDate?: Date | null; id: string; studentId: string; title: string }, actor: EventActor, meta: RequestMeta = {}) {
    if (!counselingCase.followUpDate) return { requested: 0, recipients: 0, created: 0, skipped: 0 };
    const userIds = [counselingCase.counselorId, counselingCase.createdById].filter((userId): userId is string => Boolean(userId));
    return this.dispatch.notifyUsers(userIds, {
      action: "follow-up",
      body: `Tindak lanjut kasus BK "${counselingCase.title}" dijadwalkan ${formatDate(counselingCase.followUpDate)}.`,
      dedupeKey: `counseling-follow-up:${counselingCase.id}:${counselingCase.followUpDate.toISOString()}`,
      entityId: counselingCase.id,
      entityType: "CounselingCase",
      metadata: { followUpDate: counselingCase.followUpDate.toISOString(), studentId: counselingCase.studentId },
      title: "Tindak lanjut kasus BK",
      type: "COUNSELING_FOLLOW_UP",
      url: "/admin/counseling/cases"
    }, {
      ...meta,
      action: "notification.dispatch.counseling-follow-up",
      actorId: actorId(actor),
      entity: "CounselingCase",
      entityId: counselingCase.id,
      metadata: { studentId: counselingCase.studentId }
    });
  }

  private async studentAndGuardianUsers(studentId: string) {
    const [studentUsers, guardianUsers] = await Promise.all([
      this.recipients.studentUser(studentId),
      this.recipients.guardiansOfStudent(studentId)
    ]);
    return [...studentUsers, ...guardianUsers];
  }
}

function actorId(actor: EventActor) {
  if (!actor) return null;
  return typeof actor === "string" ? actor : actor.id;
}

function trimBody(value: string) {
  return value.length > 220 ? `${value.slice(0, 217)}...` : value;
}

function formatCurrency(value: unknown) {
  return new Intl.NumberFormat("id-ID", { currency: "IDR", maximumFractionDigits: 0, style: "currency" }).format(Number(value ?? 0));
}

function attendanceLabel(status: string) {
  const labels: Record<string, string> = { ABSENT: "alpha", LATE: "terlambat", PERMIT: "izin", SICK: "sakit" };
  return labels[status] ?? status;
}

function formatDate(value: Date) {
  return value.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
}

function combineDispatchResults(...results: Array<{ requested: number; recipients: number; created: number; skipped: number }>) {
  return results.reduce((total, result) => ({
    requested: total.requested + result.requested,
    recipients: total.recipients + result.recipients,
    created: total.created + result.created,
    skipped: total.skipped + result.skipped
  }), { requested: 0, recipients: 0, created: 0, skipped: 0 });
}
