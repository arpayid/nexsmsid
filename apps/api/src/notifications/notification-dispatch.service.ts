import { Inject, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { AuditService } from "../audit/audit.service";
import { RequestMeta } from "../auth/auth.types";
import { PrismaService } from "../database/prisma.service";

export type NotificationDispatchPayload = {
  action: string;
  body: string;
  entityId: string;
  entityType: string;
  title: string;
  type: string;
  url?: string;
  metadata?: Record<string, unknown>;
  dedupeKey?: string;
};

export type NotificationDispatchAudit = RequestMeta & {
  action: string;
  actorId?: string | null;
  entity: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
};

@Injectable()
export class NotificationDispatchService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(AuditService) private readonly auditService: AuditService
  ) {}

  async notifyUsers(userIds: string[], payload: NotificationDispatchPayload, audit: NotificationDispatchAudit) {
    const uniqueUserIds = Array.from(new Set(userIds.filter(Boolean)));
    if (!uniqueUserIds.length) {
      await this.auditService.record({
        ...audit,
        metadata: { ...(audit.metadata ?? {}), requested: userIds.length, recipients: 0, created: 0, skipped: 0 }
      });
      return { requested: userIds.length, recipients: 0, created: 0, skipped: 0 };
    }

    const activeUsers = await this.prisma.user.findMany({
      where: { id: { in: uniqueUserIds }, deletedAt: null, status: "ACTIVE" },
      select: { id: true }
    });

    let created = 0;
    let skipped = 0;
    const metadata = {
      ...(payload.metadata ?? {}),
      action: payload.action,
      dedupeKey: payload.dedupeKey ?? null,
      entityId: payload.entityId,
      entityType: payload.entityType,
      type: payload.type,
      url: payload.url ?? null
    };

    for (const user of activeUsers) {
      if (payload.dedupeKey) {
        const existing = await this.prisma.notification.findFirst({
          where: {
            userId: user.id,
            metadata: { path: ["dedupeKey"], equals: payload.dedupeKey }
          }
        });
        if (existing) {
          skipped += 1;
          continue;
        }
      }

      await this.prisma.notification.create({
        data: {
          userId: user.id,
          title: payload.title,
          body: payload.body,
          channel: "IN_APP",
          status: "UNREAD",
          metadata: metadata as Prisma.InputJsonValue
        }
      });
      created += 1;
    }

    await this.auditService.record({
      ...audit,
      metadata: {
        ...(audit.metadata ?? {}),
        created,
        recipients: activeUsers.length,
        requested: userIds.length,
        skipped,
        type: payload.type
      } as Prisma.InputJsonValue
    });

    return { requested: userIds.length, recipients: activeUsers.length, created, skipped };
  }
}
