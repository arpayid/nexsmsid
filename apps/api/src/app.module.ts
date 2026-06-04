import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppConfigModule } from "./config/app-config.module";
import { DatabaseModule } from "./database/database.module";
import { HealthModule } from "./health/health.module";

@Module({
  imports: [AppConfigModule, DatabaseModule, HealthModule],
  controllers: [AppController]
})
export class AppModule {}
