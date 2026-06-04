import { Module } from "@nestjs/common";

import { AcademicYearsModule } from "./academic-years/academic-years.module";
import { AppController } from "./app.controller";
import { AttendanceModule } from "./attendance/attendance.module";
import { AuditModule } from "./audit/audit.module";
import { AuthModule } from "./auth/auth.module";
import { ClassroomsModule } from "./classrooms/classrooms.module";
import { CompetenciesModule } from "./competencies/competencies.module";
import { AppConfigModule } from "./config/app-config.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { DatabaseModule } from "./database/database.module";
import { DepartmentsModule } from "./departments/departments.module";
import { GradesModule } from "./grades/grades.module";
import { GuardiansModule } from "./guardians/guardians.module";
import { HealthModule } from "./health/health.module";
import { LessonHoursModule } from "./lesson-hours/lesson-hours.module";
import { PaymentCategoriesModule } from "./payment-categories/payment-categories.module";
import { PermissionsModule } from "./permissions/permissions.module";
import { RolesModule } from "./roles/roles.module";
import { RoomsModule } from "./rooms/rooms.module";
import { SchedulesModule } from "./schedules/schedules.module";
import { SchoolProfileModule } from "./school-profile/school-profile.module";
import { SemestersModule } from "./semesters/semesters.module";
import { StaffsModule } from "./staffs/staffs.module";
import { StudentsModule } from "./students/students.module";
import { SubjectsModule } from "./subjects/subjects.module";
import { TeachersModule } from "./teachers/teachers.module";
import { TeachingAssignmentsModule } from "./teaching-assignments/teaching-assignments.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    AuditModule,
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
    GradesModule
  ],
  controllers: [AppController]
})
export class AppModule {}
