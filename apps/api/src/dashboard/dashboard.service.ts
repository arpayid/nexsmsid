import { Socket } from "node:net";

import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { PrismaService } from "../database/prisma.service";

@Injectable()
export class DashboardService {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(PrismaService) private readonly prisma: PrismaService
  ) {}

  async getSummary() {
    const now = new Date();
    const [totalUsers, activeUsers, inactiveUsers, suspendedUsers, totalRoles, totalPermissions, totalAuditLogs, activeRefreshTokens] =
      await this.prisma.$transaction([
        this.prisma.user.count({ where: { deletedAt: null } }),
        this.prisma.user.count({ where: { deletedAt: null, status: "ACTIVE" } }),
        this.prisma.user.count({ where: { deletedAt: null, status: "INACTIVE" } }),
        this.prisma.user.count({ where: { deletedAt: null, status: "SUSPENDED" } }),
        this.prisma.role.count(),
        this.prisma.permission.count(),
        this.prisma.auditLog.count(),
        this.prisma.refreshToken.count({
          where: {
            expiresAt: { gt: now },
            revokedAt: null
          }
        })
      ]);

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        suspended: suspendedUsers
      },
      roles: {
        total: totalRoles
      },
      permissions: {
        total: totalPermissions
      },
      auditLogs: {
        total: totalAuditLogs
      },
      refreshTokens: {
        active: activeRefreshTokens
      }
    };
  }

  async getUserRoleSummary() {
    const roles = await this.prisma.role.findMany({
      include: {
        permissions: true,
        users: {
          include: {
            user: true
          }
        }
      },
      orderBy: { name: "asc" }
    });

    return roles.map((role) => ({
      id: role.id,
      name: role.name,
      slug: role.slug,
      isActive: role.isActive,
      totalUsers: role.users.filter(({ user }) => !user.deletedAt).length,
      activeUsers: role.users.filter(({ user }) => !user.deletedAt && user.status === "ACTIVE").length,
      totalPermissions: role.permissions.length
    }));
  }

  async getRecentActivities() {
    const activities = await this.prisma.auditLog.findMany({
      include: {
        actor: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 10
    });

    return activities.map((activity) => ({
      id: activity.id,
      action: activity.action,
      entity: activity.entity,
      entityId: activity.entityId,
      metadata: activity.metadata,
      actor: activity.actor
        ? {
            id: activity.actor.id,
            email: activity.actor.email,
            name: activity.actor.name
          }
        : null,
      createdAt: activity.createdAt
    }));
  }

  async getSystemStatus() {
    const redisUrl = this.configService.getOrThrow<string>("REDIS_URL");
    const redis = await this.checkRedis(redisUrl);

    await this.prisma.$queryRaw`SELECT 1`;

    return {
      api: {
        status: "ok",
        version: process.env.npm_package_version ?? "0.0.0",
        uptime: Math.round(process.uptime())
      },
      database: {
        provider: "postgresql",
        status: "connected"
      },
      redis,
      generatedAt: new Date().toISOString()
    };
  }

  private async checkRedis(redisUrl: string) {
    try {
      const url = new URL(redisUrl);
      const host = url.hostname || "localhost";
      const port = Number(url.port || 6379);
      const available = await this.canConnect(host, port);

      return {
        configured: true,
        available,
        status: available ? "available" : "unavailable",
        host,
        port
      };
    } catch {
      return {
        configured: Boolean(redisUrl),
        available: false,
        status: "invalid_config"
      };
    }
  }

  private canConnect(host: string, port: number) {
    return new Promise<boolean>((resolve) => {
      const socket = new Socket();

      socket.setTimeout(750);
      socket.once("connect", () => {
        socket.destroy();
        resolve(true);
      });
      socket.once("error", () => {
        socket.destroy();
        resolve(false);
      });
      socket.once("timeout", () => {
        socket.destroy();
        resolve(false);
      });
      socket.connect(port, host);
    });
  }
}
