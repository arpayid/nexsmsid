import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Res } from "@nestjs/common";
import { Response } from "express";
import { InventoryService } from "./inventory.service";
import { InventoryPdfService } from "./inventory-pdf.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { AuthenticatedUser } from "../auth/auth.types";
import {
  CreateInventoryCategoryDto, UpdateInventoryCategoryDto,
  CreateInventoryLocationDto, UpdateInventoryLocationDto,
  CreateInventoryItemDto, UpdateInventoryItemDto,
  CreateInventoryMovementDto, CreateInventoryMaintenanceDto,
  UpdateInventoryMaintenanceDto, CreateInventoryLoanDto,
  UpdateInventoryLoanDto, InventoryQueryDto
} from "./inventory.dto";

@Controller("inventory")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly pdfService: InventoryPdfService
  ) {}

  // Categories
  @Get("categories")
  @RequirePermissions("inventory.view")
  getCategories() {
    return this.inventoryService.getCategories();
  }

  @Post("categories")
  @RequirePermissions("inventory.create")
  createCategory(@Body() dto: CreateInventoryCategoryDto, @CurrentUser() user: AuthenticatedUser) {
    return this.inventoryService.createCategory(dto, user.id);
  }

  @Get("categories/:id")
  @RequirePermissions("inventory.view")
  getCategory(@Param("id") id: string) {
    return this.inventoryService.getCategory(id);
  }

  @Patch("categories/:id")
  @RequirePermissions("inventory.update")
  updateCategory(@Param("id") id: string, @Body() dto: UpdateInventoryCategoryDto, @CurrentUser() user: AuthenticatedUser) {
    return this.inventoryService.updateCategory(id, dto, user.id);
  }

  @Delete("categories/:id")
  @RequirePermissions("inventory.delete")
  deleteCategory(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.inventoryService.deleteCategory(id, user.id);
  }

  // Locations
  @Get("locations")
  @RequirePermissions("inventory.view")
  getLocations() {
    return this.inventoryService.getLocations();
  }

  @Post("locations")
  @RequirePermissions("inventory.create")
  createLocation(@Body() dto: CreateInventoryLocationDto, @CurrentUser() user: AuthenticatedUser) {
    return this.inventoryService.createLocation(dto, user.id);
  }

  @Get("locations/:id")
  @RequirePermissions("inventory.view")
  getLocation(@Param("id") id: string) {
    return this.inventoryService.getLocation(id);
  }

  @Patch("locations/:id")
  @RequirePermissions("inventory.update")
  updateLocation(@Param("id") id: string, @Body() dto: UpdateInventoryLocationDto, @CurrentUser() user: AuthenticatedUser) {
    return this.inventoryService.updateLocation(id, dto, user.id);
  }

  @Delete("locations/:id")
  @RequirePermissions("inventory.delete")
  deleteLocation(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.inventoryService.deleteLocation(id, user.id);
  }

  // Items
  @Get("items")
  @RequirePermissions("inventory.view")
  getItems(@Query() query: InventoryQueryDto) {
    return this.inventoryService.getItems(query);
  }

  @Post("items")
  @RequirePermissions("inventory.create")
  createItem(@Body() dto: CreateInventoryItemDto, @CurrentUser() user: AuthenticatedUser) {
    return this.inventoryService.createItem(dto, user.id);
  }

  @Get("items/:id")
  @RequirePermissions("inventory.view")
  getItem(@Param("id") id: string) {
    return this.inventoryService.getItem(id);
  }

  @Patch("items/:id")
  @RequirePermissions("inventory.update")
  updateItem(@Param("id") id: string, @Body() dto: UpdateInventoryItemDto, @CurrentUser() user: AuthenticatedUser) {
    return this.inventoryService.updateItem(id, dto, user.id);
  }

  @Delete("items/:id")
  @RequirePermissions("inventory.delete")
  deleteItem(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.inventoryService.deleteItem(id, user.id);
  }

  @Get("items/:id/movements")
  @RequirePermissions("inventory.view")
  getItemMovements(@Param("id") id: string) {
    return this.inventoryService.getItemMovements(id);
  }

  // Movements
  @Get("movements")
  @RequirePermissions("inventory.view")
  getMovements(@Query() query: InventoryQueryDto) {
    return this.inventoryService.getMovements(query);
  }

  @Post("movements")
  @RequirePermissions("inventory.transfer")
  createMovement(@Body() dto: CreateInventoryMovementDto, @CurrentUser() user: AuthenticatedUser) {
    return this.inventoryService.createMovement(dto, user.id);
  }

  // Maintenance
  @Get("maintenances")
  @RequirePermissions("inventory.maintenance")
  getMaintenances(@Query() query: InventoryQueryDto) {
    return this.inventoryService.getMaintenances(query);
  }

  @Post("maintenances")
  @RequirePermissions("inventory.maintenance")
  createMaintenance(@Body() dto: CreateInventoryMaintenanceDto, @CurrentUser() user: AuthenticatedUser) {
    return this.inventoryService.createMaintenance(dto, user.id);
  }

  @Get("maintenances/:id")
  @RequirePermissions("inventory.maintenance")
  getMaintenance(@Param("id") id: string) {
    return this.inventoryService.getMaintenance(id);
  }

  @Patch("maintenances/:id")
  @RequirePermissions("inventory.maintenance")
  updateMaintenance(@Param("id") id: string, @Body() dto: UpdateInventoryMaintenanceDto, @CurrentUser() user: AuthenticatedUser) {
    return this.inventoryService.updateMaintenance(id, dto, user.id);
  }

  @Post("maintenances/:id/start")
  @RequirePermissions("inventory.maintenance")
  startMaintenance(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.inventoryService.startMaintenance(id, user.id);
  }

  @Post("maintenances/:id/complete")
  @RequirePermissions("inventory.maintenance")
  completeMaintenance(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.inventoryService.completeMaintenance(id, user.id);
  }

  @Post("maintenances/:id/cancel")
  @RequirePermissions("inventory.maintenance")
  cancelMaintenance(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.inventoryService.cancelMaintenance(id, user.id);
  }

  @Delete("maintenances/:id")
  @RequirePermissions("inventory.maintenance")
  deleteMaintenance(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.inventoryService.deleteMaintenance(id, user.id);
  }

  // Loans
  @Get("loans")
  @RequirePermissions("inventory.view")
  getLoans(@Query() query: InventoryQueryDto) {
    return this.inventoryService.getLoans(query);
  }

  @Post("loans")
  @RequirePermissions("inventory.borrow")
  createLoan(@Body() dto: CreateInventoryLoanDto, @CurrentUser() user: AuthenticatedUser) {
    return this.inventoryService.createLoan(dto, user.id);
  }

  @Get("loans/:id")
  @RequirePermissions("inventory.view")
  getLoan(@Param("id") id: string) {
    return this.inventoryService.getLoan(id);
  }

  @Patch("loans/:id")
  @RequirePermissions("inventory.update")
  updateLoan(@Param("id") id: string, @Body() dto: UpdateInventoryLoanDto, @CurrentUser() user: AuthenticatedUser) {
    return this.inventoryService.updateLoan(id, dto, user.id);
  }

  @Post("loans/:id/approve")
  @RequirePermissions("inventory.approve-loan")
  approveLoan(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.inventoryService.approveLoan(id, user.id);
  }

  @Post("loans/:id/reject")
  @RequirePermissions("inventory.approve-loan")
  rejectLoan(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.inventoryService.rejectLoan(id, user.id);
  }

  @Post("loans/:id/mark-borrowed")
  @RequirePermissions("inventory.borrow")
  markLoanBorrowed(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.inventoryService.markLoanBorrowed(id, user.id);
  }

  @Post("loans/:id/return")
  @RequirePermissions("inventory.return")
  returnLoan(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.inventoryService.returnLoan(id, user.id);
  }

  @Post("loans/:id/cancel")
  @RequirePermissions("inventory.borrow")
  cancelLoan(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.inventoryService.cancelLoan(id, user.id);
  }

  @Delete("loans/:id")
  @RequirePermissions("inventory.delete")
  deleteLoan(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.inventoryService.deleteLoan(id, user.id);
  }

  // Summary & Dashboard
  @Get("summary")
  @RequirePermissions("inventory.view")
  getSummary() {
    return this.inventoryService.getSummary();
  }

  @Get("low-stock")
  @RequirePermissions("inventory.view")
  getLowStockItems() {
    return this.inventoryService.getLowStockItems();
  }

  @Get("maintenance-due")
  @RequirePermissions("inventory.maintenance")
  getMaintenanceDue() {
    return this.inventoryService.getMaintenanceDue();
  }

  @Get("loans-overdue")
  @RequirePermissions("inventory.view")
  getLoansOverdue() {
    return this.inventoryService.getLoansOverdue();
  }

  // PDFs
  @Get("items/:id/print")
  @RequirePermissions("inventory.print")
  async printItem(@Param("id") id: string, @Res() res: Response) {
    const buffer = await this.pdfService.generateItemPdf(id);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=item-${id}.pdf`);
    res.send(buffer);
  }

  @Get("items/:id/label")
  @RequirePermissions("inventory.print")
  async printItemLabel(@Param("id") id: string, @Res() res: Response) {
    const buffer = await this.pdfService.generateItemLabelPdf(id);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=label-${id}.pdf`);
    res.send(buffer);
  }

  @Get("loans/:id/print")
  @RequirePermissions("inventory.print")
  async printLoan(@Param("id") id: string, @Res() res: Response) {
    const buffer = await this.pdfService.generateLoanPdf(id);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=loan-${id}.pdf`);
    res.send(buffer);
  }

  @Get("summary.pdf")
  @RequirePermissions("inventory.print")
  async printSummary(@Res() res: Response) {
    const buffer = await this.pdfService.generateSummaryPdf();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=inventory-summary.pdf`);
    res.send(buffer);
  }
}
