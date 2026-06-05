import { Module } from "@nestjs/common";

import { AuditModule } from "../audit/audit.module";
import { AuthModule } from "../auth/auth.module";
import { DatabaseModule } from "../database/database.module";
import { NotificationDispatchService } from "./notification-dispatch.service";
import { NotificationEventService } from "./notification-event.service";
import { NotificationRecipientResolverService } from "./notification-recipient-resolver.service";
import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";

@Module({
  imports: [AuthModule, DatabaseModule, AuditModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationDispatchService, NotificationEventService, NotificationRecipientResolverService],
  exports: [NotificationsService, NotificationDispatchService, NotificationEventService, NotificationRecipientResolverService]
})
export class NotificationsModule {}
