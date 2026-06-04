import { Module } from "@nestjs/common";

import { AcademicYearsModule } from "./academic-years/academic-years.module";
import { AppController } from "./app.controller";
import { AuditModule } from "./audit/audit.module";
import { AuthModule } from "./auth/auth.module";
import { ClassroomsModule } from "./classrooms/classrooms.module";
import { CompetenciesModule } from "./competencies/competencies.module";
import { AppConfigModule } from "./config/app-config.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { DatabaseModule } from "./database/database.module";
import { DepartmentsModule } from "./departments/departments.module";
import { HealthModule } from "./health/health.module";
import { LessonHoursModule } from "./lesson-hours/lesson-hours.module";
import { PaymentCategoriesModule } from "./payment-categories/payment-categories.module";
import { PermissionsModule } from "./permissions/permissions.module";
import { RolesModule } from "./roles/roles.module";
import { RoomsModule } from "./rooms/rooms.module";
import { SchoolProfileModule } from "./school-profile/school-profile.module";
import { SemestersModule } from "./semesters/semesters.module";
import { SubjectsModule } from "./subjects/subjects.module";
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
    PermissionsModule
  ],
  controllers: [AppController]
})
export class AppModule {}
