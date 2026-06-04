import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { ExpensesService } from "./expenses.service";

@Controller("expenses")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class ExpensesController {
  constructor(@Inject(ExpensesService) private readonly service: ExpensesService) {}

  @Get()
  @RequirePermissions("expenses.view")
  async list(@Query() query: unknown) {
    const result = await this.service.list(query);
    return apiSuccess("Expenses retrieved", result.items, { page: result.page, limit: result.limit, total: result.total });
  }

  @Get(":id")
  @RequirePermissions("expenses.view")
  async findById(@Param("id") id: string) {
    return apiSuccess("Expense retrieved", await this.service.findById(id));
  }

  @Post()
  @RequirePermissions("expenses.create")
  async create(@Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Expense created", await this.service.create(body, user, getRequestMeta(request)));
  }

  @Patch(":id")
  @RequirePermissions("expenses.update")
  async update(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Expense updated", await this.service.update(id, body, user, getRequestMeta(request)));
  }

  @Delete(":id")
  @RequirePermissions("expenses.delete")
  async delete(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Expense deleted", await this.service.delete(id, user, getRequestMeta(request)));
  }

  @Post(":id/approve")
  @RequirePermissions("expenses.approve")
  async approve(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Expense approved", await this.service.approve(id, user, getRequestMeta(request)));
  }

  @Post(":id/mark-paid")
  @RequirePermissions("expenses.pay")
  async markPaid(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Expense marked paid", await this.service.markPaid(id, user, getRequestMeta(request)));
  }
}
