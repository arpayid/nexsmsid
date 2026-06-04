import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { PrismaService } from "../../database/prisma.service";
import { JwtAccessPayload, RequestWithUser } from "../auth.types";
import { toAuthenticatedUser } from "../auth-user.mapper";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(PrismaService) private readonly prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException("Missing bearer token");
    }

    let payload: JwtAccessPayload;

    try {
      payload = await this.jwtService.verifyAsync<JwtAccessPayload>(token, {
        secret: this.configService.getOrThrow<string>("JWT_ACCESS_SECRET")
      });
    } catch {
      throw new UnauthorizedException("Invalid or expired access token");
    }

    if (payload.type !== "access") {
      throw new UnauthorizedException("Invalid token type");
    }

    const user = await this.prisma.user.findFirst({
      where: {
        id: payload.sub,
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

    if (!user) {
      throw new UnauthorizedException("User is not active");
    }

    request.user = toAuthenticatedUser(user);
    return true;
  }

  private extractToken(request: RequestWithUser) {
    const authorization = request.headers.authorization;
    const value = Array.isArray(authorization) ? authorization[0] : authorization;

    if (!value?.startsWith("Bearer ")) {
      return null;
    }

    return value.slice("Bearer ".length).trim();
  }
}
