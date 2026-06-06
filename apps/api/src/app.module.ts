import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

import { AcademicYearsModule } from "./academic-years/academic-years.module";
import { AlumniModule } from "./alumni/alumni.module";
import { AnnouncementsModule } from "./announcements/announcements.module";
import { AppController } from "./app.controller";
import { AttendanceModule } from "./attendance/attendance.module";
import { AuditModule } from "./audit/audit.module";
import { AuthModule } from "./auth/auth.module";
import { BkkDashboardModule } from "./bkk-dashboard/bkk-dashboard.module";
import { ClassroomsModule } from "./classrooms/classrooms.module";
import { CompetenciesModule } from "./competencies/competencies.module";
import { AppConfigModule } from "./config/app-config.module";
import { CounselingModule } from "./counseling/counseling.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { DatabaseModule } from "./database/database.module";
import { DepartmentsModule } from "./departments/departments.module";
import { DisciplineModule } from "./discipline/discipline.module";
import { ExcelModule } from "./excel/excel.module";
import { ExportHistoryModule } from "./export-history/export-history.module";
import { ExpensesModule } from "./expenses/expenses.module";
import { FinanceDashboardModule } from "./finance-dashboard/finance-dashboard.module";
import { GradesModule } from "./grades/grades.module";
import { GuardianPortalModule } from "./guardian-portal/guardian-portal.module";
import { GuardiansModule } from "./guardians/guardians.module";
import { HealthModule } from "./health/health.module";
import { IndustryPartnersModule } from "./industry-partners/industry-partners.module";
import { InvoicesModule } from "./invoices/invoices.module";
import { InternalMessagesModule } from "./internal-messages/internal-messages.module";
import { InternshipLogsModule } from "./internship-logs/internship-logs.module";
import { InternshipsModule } from "./internships/internships.module";
import { JobApplicationsModule } from "./job-applications/job-applications.module";
import { JobVacanciesModule } from "./job-vacancies/job-vacancies.module";
import { LessonHoursModule } from "./lesson-hours/lesson-hours.module";
import { LettersModule } from "./letters/letters.module";
import { NotificationTemplatesModule } from "./notification-templates/notification-templates.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { PaymentCategoriesModule } from "./payment-categories/payment-categories.module";
import { PaymentsModule } from "./payments/payments.module";
import { PdfModule } from "./pdf/pdf.module";
import { PermissionsModule } from "./permissions/permissions.module";
import { PpdbDashboardModule } from "./ppdb-dashboard/ppdb-dashboard.module";
import { PpdbPeriodsModule } from "./ppdb-periods/ppdb-periods.module";
import { PpdbRegistrationsModule } from "./ppdb-registrations/ppdb-registrations.module";
import { PublicPpdbModule } from "./public-ppdb/public-ppdb.module";
import { ReportCenterModule } from "./report-center/report-center.module";
import { ReportJobsModule } from "./report-jobs/report-jobs.module";
import { RolesModule } from "./roles/roles.module";
import { RoomsModule } from "./rooms/rooms.module";
import { SchedulesModule } from "./schedules/schedules.module";
import { SchoolProfileModule } from "./school-profile/school-profile.module";
import { SemestersModule } from "./semesters/semesters.module";
import { StaffsModule } from "./staffs/staffs.module";
import { StudentPortalModule } from "./student-portal/student-portal.module";
import { StudentsModule } from "./students/students.module";
import { SubjectsModule } from "./subjects/subjects.module";
import { TeachersModule } from "./teachers/teachers.module";
import { TeacherPortalModule } from "./teacher-portal/teacher-portal.module";
import { TeachingAssignmentsModule } from "./teaching-assignments/teaching-assignments.module";
import { TracerStudiesModule } from "./tracer-studies/tracer-studies.module";
import { UsersModule } from "./users/users.module";
import { InventoryModule } from "./inventory/inventory.module";
import { LibraryModule } from "./library/library.module";

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    AuditModule,
    ExcelModule,
    PdfModule,
    AuthModule,
    DashboardModule,
    HealthModule,
    SchoolProfileModule,
    AcademicYearsModule,
    SemestersModule,
    DepartmentsModule,
    CompetenciesModule,
    ClassroomsModule,
    RoomsModule,
    SubjectsModule,
    LessonHoursModule,
    LettersModule,
    PaymentCategoriesModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    StudentsModule,
    GuardiansModule,
    TeachersModule,
    StaffsModule,
    TeachingAssignmentsModule,
    SchedulesModule,
    AttendanceModule,
    GradesModule,
    InvoicesModule,
    PaymentsModule,
    ExpensesModule,
    FinanceDashboardModule,
    PpdbPeriodsModule,
    PpdbRegistrationsModule,
    PpdbDashboardModule,
    PublicPpdbModule,
    IndustryPartnersModule,
    InternshipsModule,
    InternshipLogsModule,
    AlumniModule,
    JobVacanciesModule,
    JobApplicationsModule,
    TracerStudiesModule,
    BkkDashboardModule,
    CounselingModule,
    DisciplineModule,
    TeacherPortalModule,
    StudentPortalModule,
    GuardianPortalModule,
    AnnouncementsModule,
    InternalMessagesModule,
    NotificationsModule,
    NotificationTemplatesModule,
    ReportJobsModule,
    ExportHistoryModule,
    ReportCenterModule,
    InventoryModule,
    LibraryModule,
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>("RATE_LIMIT_TTL") ?? 60,
          limit: config.get<number>("RATE_LIMIT_LIMIT") ?? 100
        }
      ]
    })
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {}
