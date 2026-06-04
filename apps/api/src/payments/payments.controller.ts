import { Body, Controller, Get, Inject, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { PaymentsService } from "./payments.service";

@Controller("payments")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class PaymentsController {
  constructor(@Inject(PaymentsService) private readonly service: PaymentsService) {}

  @Get()
  @RequirePermissions("payments.view")
  async list(@Query() query: unknown) {
    const result = await this.service.list(query);
    return apiSuccess("Payments retrieved", result.items, { page: result.page, limit: result.limit, total: result.total });
  }

  @Get(":id")
  @RequirePermissions("payments.view")
  async findById(@Param("id") id: string) {
    return apiSuccess("Payment retrieved", await this.service.findById(id));
  }

  @Post()
  @RequirePermissions("payments.create")
  async create(@Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Payment created", await this.service.create(body, user, getRequestMeta(request)));
  }

  @Patch(":id")
  @RequirePermissions("payments.create")
  async update(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Payment updated", await this.service.update(id, body, user, getRequestMeta(request)));
  }

  @Post(":id/verify")
  @RequirePermissions("payments.verify")
  async verify(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Payment verified", await this.service.verify(id, body, user, getRequestMeta(request)));
  }

  @Post(":id/reject")
  @RequirePermissions("payments.reject")
  async reject(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Payment rejected", await this.service.reject(id, body, user, getRequestMeta(request)));
  }

  @Post(":id/cancel")
  @RequirePermissions("payments.cancel")
  async cancel(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Payment cancelled", await this.service.cancel(id, user, getRequestMeta(request)));
  }
}
