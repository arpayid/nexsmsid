import { randomUUID } from "node:crypto";

import { BadRequestException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { z } from "zod";

import { AuditService } from "../audit/audit.service";
import { parseWithSchema } from "../common/validation";
import { PrismaService } from "../database/prisma.service";
import { AuthenticatedUser, JwtRefreshPayload, RequestMeta } from "./auth.types";
import { toAuthenticatedUser } from "./auth-user.mapper";
import { PasswordService } from "./password.service";

const loginSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase()),
  password: z.string().min(1)
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1)
});

const logoutSchema = z.object({
  refreshToken: z.string().min(1).optional()
});

@Injectable()
export class AuthService {
  constructor(
    @Inject(AuditService) private readonly auditService: AuditService,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(PasswordService) private readonly passwordService: PasswordService,
    @Inject(PrismaService) private readonly prisma: PrismaService
  ) {}

  async login(input: unknown, meta: RequestMeta) {
    const credentials = parseWithSchema(loginSchema, input);
    const user = await this.findAuthUserByEmail(credentials.email);

    if (!user) {
      await this.auditService.record({
        ...meta,
        action: "auth.login_failed",
        entity: "user",
        metadata: { email: credentials.email, reason: "user_not_found" }
      });
      throw new UnauthorizedException("Invalid email or password");
    }

    const passwordValid = await this.passwordService.verify(credentials.password, user.passwordHash);

    if (!passwordValid) {
      await this.auditService.record({
        ...meta,
        actorId: user.id,
        action: "auth.login_failed",
        entity: "user",
        entityId: user.id,
        metadata: { email: credentials.email, reason: "invalid_password" }
      });
      throw new UnauthorizedException("Invalid email or password");
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    const authUser = toAuthenticatedUser(user);
    const tokens = await this.createTokenPair(authUser, meta);

    await this.auditService.record({
      ...meta,
      actorId: user.id,
      action: "auth.login",
      entity: "user",
      entityId: user.id
    });

    return {
      user: authUser,
      ...tokens
    };
  }

  async refresh(input: unknown, meta: RequestMeta) {
    const { refreshToken } = parseWithSchema(refreshSchema, input);
    const payload = await this.verifyRefreshToken(refreshToken);
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { id: payload.jti },
      include: {
        user: {
          include: {
            roles: {
              include: {
                role: {
                  include: {
                    permissions: {
                      include: { permission: true }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!storedToken || storedToken.revokedAt || storedToken.expiresAt <= new Date() || storedToken.user.deletedAt) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const refreshTokenValid = await this.passwordService.verify(refreshToken, storedToken.tokenHash);

    if (!refreshTokenValid || storedToken.user.status !== "ACTIVE") {
      throw new UnauthorizedException("Invalid refresh token");
    }

    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() }
    });

    const authUser = toAuthenticatedUser(storedToken.user);
    const tokens = await this.createTokenPair(authUser, meta);

    await this.auditService.record({
      ...meta,
      actorId: authUser.id,
      action: "auth.refresh",
      entity: "refresh_token",
      entityId: storedToken.id
    });

    return {
      user: authUser,
      ...tokens
    };
  }

  async logout(user: AuthenticatedUser, input: unknown, meta: RequestMeta) {
    const { refreshToken } = parseWithSchema(logoutSchema, input ?? {});
    let revoked = 0;

    if (refreshToken) {
      const payload = await this.verifyRefreshToken(refreshToken);
      const result = await this.prisma.refreshToken.updateMany({
        where: {
          id: payload.jti,
          userId: user.id,
          revokedAt: null
        },
        data: { revokedAt: new Date() }
      });
      revoked = result.count;
    } else {
      const result = await this.prisma.refreshToken.updateMany({
        where: {
          userId: user.id,
          revokedAt: null
        },
        data: { revokedAt: new Date() }
      });
      revoked = result.count;
    }

    await this.auditService.record({
      ...meta,
      actorId: user.id,
      action: "auth.logout",
      entity: "user",
      entityId: user.id,
      metadata: { revokedRefreshTokens: revoked }
    });

    return { revokedRefreshTokens: revoked };
  }

  async me(user: AuthenticatedUser) {
    return user;
  }

  private async findAuthUserByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
        status: "ACTIVE"
      },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  private async createTokenPair(user: AuthenticatedUser, meta: RequestMeta) {
    const refreshTokenId = randomUUID();
    const accessTokenTtl = this.parseExpiresIn(this.configService.getOrThrow<string>("JWT_ACCESS_EXPIRES_IN"));
    const refreshTokenTtl = this.parseExpiresIn(this.configService.getOrThrow<string>("JWT_REFRESH_EXPIRES_IN"));
    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        type: "access"
      },
      {
        expiresIn: accessTokenTtl,
        secret: this.configService.getOrThrow<string>("JWT_ACCESS_SECRET")
      }
    );
    const refreshToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        jti: refreshTokenId,
        type: "refresh"
      },
      {
        expiresIn: refreshTokenTtl,
        secret: this.configService.getOrThrow<string>("JWT_REFRESH_SECRET")
      }
    );

    await this.prisma.refreshToken.create({
      data: {
        id: refreshTokenId,
        userId: user.id,
        tokenHash: await this.passwordService.hash(refreshToken),
        expiresAt: new Date(Date.now() + refreshTokenTtl * 1000),
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent
      }
    });

    return {
      accessToken,
      refreshToken,
      tokenType: "Bearer",
      expiresIn: accessTokenTtl
    };
  }

  private async verifyRefreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<JwtRefreshPayload>(refreshToken, {
        secret: this.configService.getOrThrow<string>("JWT_REFRESH_SECRET")
      });

      if (payload.type !== "refresh" || !payload.jti) {
        throw new BadRequestException("Invalid refresh token type");
      }

      return payload;
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  private parseExpiresIn(value: string) {
    const match = /^(\d+)([smhd])$/.exec(value);

    if (!match) {
      const seconds = Number(value);

      if (Number.isFinite(seconds) && seconds > 0) {
        return seconds;
      }

      throw new BadRequestException(`Invalid JWT expiration value: ${value}`);
    }

    const amount = Number(match[1]);
    const unit = match[2];
    const multiplier = unit === "s" ? 1 : unit === "m" ? 60 : unit === "h" ? 3600 : 86400;

    return amount * multiplier;
  }
}
