import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { RequestWithUser } from "../auth.types";
import { REQUIRED_PERMISSIONS_KEY } from "../decorators/require-permissions.decorator";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(@Inject(Reflector) private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(REQUIRED_PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!requiredPermissions?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const userPermissions = new Set(request.user?.permissions ?? []);
    const allowed = requiredPermissions.every((permission) => userPermissions.has(permission));

    if (!allowed) {
      throw new ForbiddenException("You do not have permission to access this resource");
    }

    return true;
  }
}
