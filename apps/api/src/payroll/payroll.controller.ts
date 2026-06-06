import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request, Res } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { PayrollService } from './payroll.service';
import { apiSuccess } from '../common/api-response';
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
  async getSummary() {
    const data = await this.payrollService.getSummary();
    return apiSuccess('Payroll summary retrieved', data);
  }

  // =========================================================================
  // COMPONENTS
  // =========================================================================

  @Get('components')
  @RequirePermissions('payroll.view')
  async getComponents(@Query() params: any) {
    const result = await this.payrollService.getComponents(params);
    return apiSuccess('Payroll components retrieved', result.data, result.meta);
  }

  @Post('components')
  @RequirePermissions('payroll.create')
  async createComponent(@Body() data: CreatePayrollComponentDto, @Request() req: any) {
    const result = await this.payrollService.createComponent(data, req.user.id);
    return apiSuccess('Payroll component created', result);
  }

  @Get('components/:id')
  @RequirePermissions('payroll.view')
  async getComponent(@Param('id') id: string) {
    const result = await this.payrollService.getComponent(id);
    return apiSuccess('Payroll component retrieved', result);
  }

  @Patch('components/:id')
  @RequirePermissions('payroll.update')
  async updateComponent(@Param('id') id: string, @Body() data: UpdatePayrollComponentDto, @Request() req: any) {
    const result = await this.payrollService.updateComponent(id, data, req.user.id);
    return apiSuccess('Payroll component updated', result);
  }

  @Delete('components/:id')
  @RequirePermissions('payroll.update')
  async deleteComponent(@Param('id') id: string, @Request() req: any) {
    const result = await this.payrollService.deleteComponent(id, req.user.id);
    return apiSuccess('Payroll component deleted', result);
  }

  // =========================================================================
  // EMPLOYEE SALARY SETTINGS
  // =========================================================================

  @Get('employees/:employeeId/components')
  @RequirePermissions('payroll.view')
  async getEmployeeComponents(@Param('employeeId') employeeId: string) {
    const result = await this.payrollService.getEmployeeComponents(employeeId);
    return apiSuccess('Employee salary components retrieved', result);
  }

  @Post('employee-components')
  @RequirePermissions('payroll.create')
  async createEmployeeComponent(@Body() data: CreateEmployeeSalaryComponentDto, @Request() req: any) {
    const result = await this.payrollService.createEmployeeComponent(data, req.user.id);
    return apiSuccess('Employee salary component created', result);
  }

  @Patch('employee-components/:id')
  @RequirePermissions('payroll.update')
  async updateEmployeeComponent(@Param('id') id: string, @Body() data: UpdateEmployeeSalaryComponentDto, @Request() req: any) {
    const result = await this.payrollService.updateEmployeeComponent(id, data, req.user.id);
    return apiSuccess('Employee salary component updated', result);
  }

  @Delete('employee-components/:id')
  @RequirePermissions('payroll.update')
  async deleteEmployeeComponent(@Param('id') id: string, @Request() req: any) {
    const result = await this.payrollService.deleteEmployeeComponent(id, req.user.id);
    return apiSuccess('Employee salary component deleted', result);
  }

  // =========================================================================
  // PERIODS
  // =========================================================================

  @Get('periods')
  @RequirePermissions('payroll.view')
  async getPeriods(@Query() params: any) {
    const result = await this.payrollService.getPeriods(params);
    return apiSuccess('Payroll periods retrieved', result.data, result.meta);
  }

  @Post('periods')
  @RequirePermissions('payroll.create')
  async createPeriod(@Body() data: CreatePayrollPeriodDto, @Request() req: any) {
    const result = await this.payrollService.createPeriod(data, req.user.id);
    return apiSuccess('Payroll period created', result);
  }

  @Get('periods/:id')
  @RequirePermissions('payroll.view')
  async getPeriod(@Param('id') id: string) {
    const result = await this.payrollService.getPeriod(id);
    return apiSuccess('Payroll period retrieved', result);
  }

  @Patch('periods/:id')
  @RequirePermissions('payroll.update')
  async updatePeriod(@Param('id') id: string, @Body() data: UpdatePayrollPeriodDto, @Request() req: any) {
    const result = await this.payrollService.updatePeriod(id, data, req.user.id);
    return apiSuccess('Payroll period updated', result);
  }

  @Delete('periods/:id')
  @RequirePermissions('payroll.update')
  async deletePeriod(@Param('id') id: string, @Request() req: any) {
    const result = await this.payrollService.deletePeriod(id, req.user.id);
    return apiSuccess('Payroll period deleted', result);
  }

  @Post('periods/:id/open')
  @RequirePermissions('payroll.update')
  async openPeriod(@Param('id') id: string, @Request() req: any) {
    const result = await this.payrollService.openPeriod(id, req.user.id);
    return apiSuccess('Payroll period opened', result);
  }

  @Post('periods/:id/calculate')
  @RequirePermissions('payroll.create')
  async calculatePeriod(@Param('id') id: string, @Request() req: any) {
    const result = await this.payrollService.calculatePeriod(id, req.user.id);
    return apiSuccess('Payroll period calculated', result);
  }

  @Post('periods/:id/approve')
  @RequirePermissions('payroll.approve')
  async approvePeriod(@Param('id') id: string, @Request() req: any) {
    const result = await this.payrollService.approvePeriod(id, req.user.id);
    return apiSuccess('Payroll period approved', result);
  }

  @Post('periods/:id/pay')
  @RequirePermissions('payroll.pay')
  async payPeriod(@Param('id') id: string, @Request() req: any) {
    const result = await this.payrollService.payPeriod(id, req.user.id);
    return apiSuccess('Payroll period paid', result);
  }

  @Post('periods/:id/close')
  @RequirePermissions('payroll.update')
  async closePeriod(@Param('id') id: string, @Request() req: any) {
    const result = await this.payrollService.closePeriod(id, req.user.id);
    return apiSuccess('Payroll period closed', result);
  }

  @Post('periods/:id/cancel')
  @RequirePermissions('payroll.update')
  async cancelPeriod(@Param('id') id: string, @Request() req: any) {
    const result = await this.payrollService.cancelPeriod(id, req.user.id);
    return apiSuccess('Payroll period cancelled', result);
  }

  // =========================================================================
  // RUNS
  // =========================================================================

  @Get('runs')
  @RequirePermissions('payroll.view')
  async getRuns(@Query() params: any) {
    const result = await this.payrollService.getRuns(params);
    return apiSuccess('Payroll runs retrieved', result.data, result.meta);
  }

  @Get('runs/:id')
  @RequirePermissions('payroll.view')
  async getRun(@Param('id') id: string) {
    const result = await this.payrollService.getRun(id);
    return apiSuccess('Payroll run retrieved', result);
  }

  @Patch('runs/:id')
  @RequirePermissions('payroll.update')
  async updateRun(@Param('id') id: string, @Body() data: UpdatePayrollRunDto, @Request() req: any) {
    const result = await this.payrollService.updateRun(id, data, req.user.id);
    return apiSuccess('Payroll run updated', result);
  }

  // =========================================================================
  // PAYSLIPS
  // =========================================================================

  @Get('payslips')
  @RequirePermissions('payroll.view')
  async getPayslips(@Query() params: any) {
    const result = await this.payrollService.getPayslips(params);
    return apiSuccess('Payslips retrieved', result.data, result.meta);
  }

  // =========================================================================
  // PAYMENTS
  // =========================================================================

  @Get('payments')
  @RequirePermissions('payroll.pay')
  async getPayments(@Query() params: any) {
    const result = await this.payrollService.getPayments(params);
    return apiSuccess('Payments retrieved', result.data, result.meta);
  }

  @Get('payslips/:id')
  @RequirePermissions('payroll.view')
  async getPayslip(@Param('id') id: string) {
    const result = await this.payrollService.getPayslip(id);
    return apiSuccess('Payslip retrieved', result);
  }

  @Post('payslips/:id/mark-paid')
  @RequirePermissions('payroll.pay')
  async markPayslipPaid(@Param('id') id: string, @Body() data: MarkPayslipPaidDto, @Request() req: any) {
    const result = await this.payrollService.markPayslipPaid(id, data, req.user.id);
    return apiSuccess('Payslip marked as paid', result);
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
