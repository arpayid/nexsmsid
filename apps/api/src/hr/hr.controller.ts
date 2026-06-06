import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { HRService } from './hr.service';
import { 
  CreateHRPositionDto, UpdateHRPositionDto, 
  CreateEmployeeProfileDto, UpdateEmployeeProfileDto,
  CreateEmployeeAttendanceDto, UpdateEmployeeAttendanceDto,
  CreateLeaveRequestDto, UpdateLeaveRequestDto, RejectLeaveRequestDto
} from './hr.dto';

@Controller('hr')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class HRController {
  constructor(private readonly hrService: HRService) {}

  // =========================================================================
  // SUMMARY
  // =========================================================================

  @Get('summary')
  @RequirePermissions('payroll.view')
  getSummary() {
    return this.hrService.getSummary();
  }

  // =========================================================================
  // POSITIONS
  // =========================================================================

  @Get('positions')
  @RequirePermissions('payroll.view')
  getPositions(@Query() params: any) {
    return this.hrService.getPositions(params);
  }

  @Post('positions')
  @RequirePermissions('payroll.create')
  createPosition(@Body() data: CreateHRPositionDto, @Request() req: any) {
    return this.hrService.createPosition(data, req.user.id);
  }

  @Get('positions/:id')
  @RequirePermissions('payroll.view')
  getPosition(@Param('id') id: string) {
    return this.hrService.getPosition(id);
  }

  @Patch('positions/:id')
  @RequirePermissions('payroll.update')
  updatePosition(@Param('id') id: string, @Body() data: UpdateHRPositionDto, @Request() req: any) {
    return this.hrService.updatePosition(id, data, req.user.id);
  }

  @Delete('positions/:id')
  @RequirePermissions('payroll.update')
  deletePosition(@Param('id') id: string, @Request() req: any) {
    return this.hrService.deletePosition(id, req.user.id);
  }

  // =========================================================================
  // EMPLOYEES
  // =========================================================================

  @Get('employees')
  @RequirePermissions('payroll.view')
  getEmployees(@Query() params: any) {
    return this.hrService.getEmployees(params);
  }

  @Post('employees')
  @RequirePermissions('payroll.create')
  createEmployee(@Body() data: CreateEmployeeProfileDto, @Request() req: any) {
    return this.hrService.createEmployee(data, req.user.id);
  }

  @Get('employees/:id')
  @RequirePermissions('payroll.view')
  getEmployee(@Param('id') id: string) {
    return this.hrService.getEmployee(id);
  }

  @Patch('employees/:id')
  @RequirePermissions('payroll.update')
  updateEmployee(@Param('id') id: string, @Body() data: UpdateEmployeeProfileDto, @Request() req: any) {
    return this.hrService.updateEmployee(id, data, req.user.id);
  }

  @Delete('employees/:id')
  @RequirePermissions('payroll.update')
  deleteEmployee(@Param('id') id: string, @Request() req: any) {
    return this.hrService.deleteEmployee(id, req.user.id);
  }

  // =========================================================================
  // ATTENDANCE
  // =========================================================================

  @Get('attendance')
  @RequirePermissions('payroll.view')
  getAttendance(@Query() params: any) {
    return this.hrService.getAttendance(params);
  }

  @Post('attendance')
  @RequirePermissions('payroll.create')
  createAttendance(@Body() data: CreateEmployeeAttendanceDto, @Request() req: any) {
    return this.hrService.createAttendance(data, req.user.id);
  }

  @Patch('attendance/:id')
  @RequirePermissions('payroll.create')
  updateAttendance(@Param('id') id: string, @Body() data: UpdateEmployeeAttendanceDto, @Request() req: any) {
    return this.hrService.updateAttendance(id, data, req.user.id);
  }

  @Delete('attendance/:id')
  @RequirePermissions('payroll.create')
  deleteAttendance(@Param('id') id: string, @Request() req: any) {
    return this.hrService.deleteAttendance(id, req.user.id);
  }

  @Get('employees/:id/attendance')
  @RequirePermissions('payroll.view')
  getEmployeeAttendance(@Param('id') id: string, @Query() params: any) {
    return this.hrService.getAttendance({ ...params, employeeId: id });
  }

  // =========================================================================
  // LEAVE REQUESTS
  // =========================================================================

  @Get('leaves')
  @RequirePermissions('payroll.view')
  getLeaveRequests(@Query() params: any) {
    return this.hrService.getLeaveRequests(params);
  }

  @Post('leaves')
  @RequirePermissions('payroll.create')
  createLeaveRequest(@Body() data: CreateLeaveRequestDto, @Request() req: any) {
    return this.hrService.createLeaveRequest(data, req.user.id);
  }

  @Get('leaves/:id')
  @RequirePermissions('payroll.view')
  getLeaveRequest(@Param('id') id: string) {
    return this.hrService.getLeaveRequest(id);
  }

  @Patch('leaves/:id')
  @RequirePermissions('payroll.create')
  updateLeaveRequest(@Param('id') id: string, @Body() data: UpdateLeaveRequestDto, @Request() req: any) {
    return this.hrService.updateLeaveRequest(id, data, req.user.id);
  }

  @Post('leaves/:id/approve')
  @RequirePermissions('payroll.approve')
  approveLeaveRequest(@Param('id') id: string, @Request() req: any) {
    return this.hrService.approveLeaveRequest(id, req.user.id);
  }

  @Post('leaves/:id/reject')
  @RequirePermissions('payroll.approve')
  rejectLeaveRequest(@Param('id') id: string, @Body() data: RejectLeaveRequestDto, @Request() req: any) {
    return this.hrService.rejectLeaveRequest(id, data, req.user.id);
  }

  @Post('leaves/:id/cancel')
  @RequirePermissions('payroll.create')
  cancelLeaveRequest(@Param('id') id: string, @Request() req: any) {
    return this.hrService.cancelLeaveRequest(id, req.user.id);
  }

  @Delete('leaves/:id')
  @RequirePermissions('payroll.update')
  deleteLeaveRequest(@Param('id') id: string, @Request() req: any) {
    return this.hrService.deleteLeaveRequest(id, req.user.id);
  }
}
