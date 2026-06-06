import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request, Res } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { PayrollService } from './payroll.service';
import { Response } from 'express';
import { 
  CreatePayrollComponentDto, UpdatePayrollComponentDto, 
  CreateEmployeeSalaryComponentDto, UpdateEmployeeSalaryComponentDto,
  CreatePayrollPeriodDto, UpdatePayrollPeriodDto,
  IssuePayslipDto, MarkPayslipPaidDto, UpdatePayrollRunDto
} from './payroll.dto';

@Controller('payroll')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  // =========================================================================
  // SUMMARY
  // =========================================================================

  @Get('summary')
  @RequirePermissions('payroll.view')
  getSummary() {
    return this.payrollService.getSummary();
  }

  // =========================================================================
  // COMPONENTS
  // =========================================================================

  @Get('components')
  @RequirePermissions('payroll.view')
  getComponents(@Query() params: any) {
    return this.payrollService.getComponents(params);
  }

  @Post('components')
  @RequirePermissions('payroll.create')
  createComponent(@Body() data: CreatePayrollComponentDto, @Request() req: any) {
    return this.payrollService.createComponent(data, req.user.id);
  }

  @Get('components/:id')
  @RequirePermissions('payroll.view')
  getComponent(@Param('id') id: string) {
    return this.payrollService.getComponent(id);
  }

  @Patch('components/:id')
  @RequirePermissions('payroll.update')
  updateComponent(@Param('id') id: string, @Body() data: UpdatePayrollComponentDto, @Request() req: any) {
    return this.payrollService.updateComponent(id, data, req.user.id);
  }

  @Delete('components/:id')
  @RequirePermissions('payroll.update')
  deleteComponent(@Param('id') id: string, @Request() req: any) {
    return this.payrollService.deleteComponent(id, req.user.id);
  }

  // =========================================================================
  // EMPLOYEE SALARY SETTINGS
  // =========================================================================

  @Get('employees/:employeeId/components')
  @RequirePermissions('payroll.view')
  getEmployeeComponents(@Param('employeeId') employeeId: string) {
    return this.payrollService.getEmployeeComponents(employeeId);
  }

  @Post('employee-components')
  @RequirePermissions('payroll.create')
  createEmployeeComponent(@Body() data: CreateEmployeeSalaryComponentDto, @Request() req: any) {
    return this.payrollService.createEmployeeComponent(data, req.user.id);
  }

  @Patch('employee-components/:id')
  @RequirePermissions('payroll.update')
  updateEmployeeComponent(@Param('id') id: string, @Body() data: UpdateEmployeeSalaryComponentDto, @Request() req: any) {
    return this.payrollService.updateEmployeeComponent(id, data, req.user.id);
  }

  @Delete('employee-components/:id')
  @RequirePermissions('payroll.update')
  deleteEmployeeComponent(@Param('id') id: string, @Request() req: any) {
    return this.payrollService.deleteEmployeeComponent(id, req.user.id);
  }

  // =========================================================================
  // PERIODS
  // =========================================================================

  @Get('periods')
  @RequirePermissions('payroll.view')
  getPeriods(@Query() params: any) {
    return this.payrollService.getPeriods(params);
  }

  @Post('periods')
  @RequirePermissions('payroll.create')
  createPeriod(@Body() data: CreatePayrollPeriodDto, @Request() req: any) {
    return this.payrollService.createPeriod(data, req.user.id);
  }

  @Get('periods/:id')
  @RequirePermissions('payroll.view')
  getPeriod(@Param('id') id: string) {
    return this.payrollService.getPeriod(id);
  }

  @Patch('periods/:id')
  @RequirePermissions('payroll.update')
  updatePeriod(@Param('id') id: string, @Body() data: UpdatePayrollPeriodDto, @Request() req: any) {
    return this.payrollService.updatePeriod(id, data, req.user.id);
  }

  @Delete('periods/:id')
  @RequirePermissions('payroll.update')
  deletePeriod(@Param('id') id: string, @Request() req: any) {
    return this.payrollService.deletePeriod(id, req.user.id);
  }

  @Post('periods/:id/open')
  @RequirePermissions('payroll.update')
  openPeriod(@Param('id') id: string, @Request() req: any) {
    return this.payrollService.openPeriod(id, req.user.id);
  }

  @Post('periods/:id/calculate')
  @RequirePermissions('payroll.create')
  calculatePeriod(@Param('id') id: string, @Request() req: any) {
    return this.payrollService.calculatePeriod(id, req.user.id);
  }

  @Post('periods/:id/approve')
  @RequirePermissions('payroll.approve')
  approvePeriod(@Param('id') id: string, @Request() req: any) {
    return this.payrollService.approvePeriod(id, req.user.id);
  }

  @Post('periods/:id/pay')
  @RequirePermissions('payroll.pay')
  payPeriod(@Param('id') id: string, @Request() req: any) {
    return this.payrollService.payPeriod(id, req.user.id);
  }

  @Post('periods/:id/close')
  @RequirePermissions('payroll.update')
  closePeriod(@Param('id') id: string, @Request() req: any) {
    return this.payrollService.closePeriod(id, req.user.id);
  }

  @Post('periods/:id/cancel')
  @RequirePermissions('payroll.update')
  cancelPeriod(@Param('id') id: string, @Request() req: any) {
    return this.payrollService.cancelPeriod(id, req.user.id);
  }

  // =========================================================================
  // RUNS
  // =========================================================================

  @Get('runs')
  @RequirePermissions('payroll.view')
  getRuns(@Query() params: any) {
    return this.payrollService.getRuns(params);
  }

  @Get('runs/:id')
  @RequirePermissions('payroll.view')
  getRun(@Param('id') id: string) {
    return this.payrollService.getRun(id);
  }

  @Patch('runs/:id')
  @RequirePermissions('payroll.update')
  updateRun(@Param('id') id: string, @Body() data: UpdatePayrollRunDto, @Request() req: any) {
    return this.payrollService.updateRun(id, data, req.user.id);
  }

  // =========================================================================
  // PAYSLIPS
  // =========================================================================

  @Get('payslips')
  @RequirePermissions('payroll.view')
  getPayslips(@Query() params: any) {
    return this.payrollService.getPayslips(params);
  }

  // =========================================================================
  // PAYMENTS
  // =========================================================================

  @Get('payments')
  @RequirePermissions('payroll.pay')
  getPayments(@Query() params: any) {
    return this.payrollService.getPayments(params);
  }

  @Get('payslips/:id')
  @RequirePermissions('payroll.view')
  getPayslip(@Param('id') id: string) {
    return this.payrollService.getPayslip(id);
  }

  @Post('payslips/:id/mark-paid')
  @RequirePermissions('payroll.pay')
  markPayslipPaid(@Param('id') id: string, @Body() data: MarkPayslipPaidDto, @Request() req: any) {
    return this.payrollService.markPayslipPaid(id, data, req.user.id);
  }

  @Get('payslips/:id/pdf')
  @RequirePermissions('payroll.print')
  async downloadPayslipPdf(@Param('id') id: string, @Res() res: Response) {
    const pdfBuffer = await this.payrollService.getPayslipPdf(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=payslip-${id}.pdf`,
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }
}
