import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AuditModule } from "./audit/audit.module";
import { AuthModule } from "./auth/auth.module";
import { AppConfigModule } from "./config/app-config.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { DatabaseModule } from "./database/database.module";
import { HealthModule } from "./health/health.module";
import { PermissionsModule } from "./permissions/permissions.module";
import { RolesModule } from "./roles/roles.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    AuditModule,
    AuthModule,
    DashboardModule,
    HealthModule,
    UsersModule,
    RolesModule,
    PermissionsModule
  ],
  controllers: [AppController]
})
export class AppModule {}
