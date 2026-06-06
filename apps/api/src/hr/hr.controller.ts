import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { HRService } from './hr.service';
import { apiSuccess } from '../common/api-response';
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
  async getSummary() {
    const data = await this.hrService.getSummary();
    return apiSuccess('HR summary retrieved', data);
  }

  // =========================================================================
  // POSITIONS
  // =========================================================================

  @Get('positions')
  @RequirePermissions('payroll.view')
  async getPositions(@Query() params: any) {
    const result = await this.hrService.getPositions(params);
    return apiSuccess('HR positions retrieved', result.data, result.meta);
  }

  @Post('positions')
  @RequirePermissions('payroll.create')
  async createPosition(@Body() data: CreateHRPositionDto, @Request() req: any) {
    const result = await this.hrService.createPosition(data, req.user.id);
    return apiSuccess('HR position created', result);
  }

  @Get('positions/:id')
  @RequirePermissions('payroll.view')
  async getPosition(@Param('id') id: string) {
    const result = await this.hrService.getPosition(id);
    return apiSuccess('HR position retrieved', result);
  }

  @Patch('positions/:id')
  @RequirePermissions('payroll.update')
  async updatePosition(@Param('id') id: string, @Body() data: UpdateHRPositionDto, @Request() req: any) {
    const result = await this.hrService.updatePosition(id, data, req.user.id);
    return apiSuccess('HR position updated', result);
  }

  @Delete('positions/:id')
  @RequirePermissions('payroll.update')
  async deletePosition(@Param('id') id: string, @Request() req: any) {
    const result = await this.hrService.deletePosition(id, req.user.id);
    return apiSuccess('HR position deleted', result);
  }

  // =========================================================================
  // EMPLOYEES
  // =========================================================================

  @Get('employees')
  @RequirePermissions('payroll.view')
  async getEmployees(@Query() params: any) {
    const result = await this.hrService.getEmployees(params);
    return apiSuccess('Employees retrieved', result.data, result.meta);
  }

  @Post('employees')
  @RequirePermissions('payroll.create')
  async createEmployee(@Body() data: CreateEmployeeProfileDto, @Request() req: any) {
    const result = await this.hrService.createEmployee(data, req.user.id);
    return apiSuccess('Employee created', result);
  }

  @Get('employees/:id')
  @RequirePermissions('payroll.view')
  async getEmployee(@Param('id') id: string) {
    const result = await this.hrService.getEmployee(id);
    return apiSuccess('Employee retrieved', result);
  }

  @Patch('employees/:id')
  @RequirePermissions('payroll.update')
  async updateEmployee(@Param('id') id: string, @Body() data: UpdateEmployeeProfileDto, @Request() req: any) {
    const result = await this.hrService.updateEmployee(id, data, req.user.id);
    return apiSuccess('Employee updated', result);
  }

  @Delete('employees/:id')
  @RequirePermissions('payroll.update')
  async deleteEmployee(@Param('id') id: string, @Request() req: any) {
    const result = await this.hrService.deleteEmployee(id, req.user.id);
    return apiSuccess('Employee deleted', result);
  }

  // =========================================================================
  // ATTENDANCE
  // =========================================================================

  @Get('attendance')
  @RequirePermissions('payroll.view')
  async getAttendance(@Query() params: any) {
    const result = await this.hrService.getAttendance(params);
    return apiSuccess('Attendance records retrieved', result.data, result.meta);
  }

  @Post('attendance')
  @RequirePermissions('payroll.create')
  async createAttendance(@Body() data: CreateEmployeeAttendanceDto, @Request() req: any) {
    const result = await this.hrService.createAttendance(data, req.user.id);
    return apiSuccess('Attendance recorded', result);
  }

  @Patch('attendance/:id')
  @RequirePermissions('payroll.create')
  async updateAttendance(@Param('id') id: string, @Body() data: UpdateEmployeeAttendanceDto, @Request() req: any) {
    const result = await this.hrService.updateAttendance(id, data, req.user.id);
    return apiSuccess('Attendance updated', result);
  }

  @Delete('attendance/:id')
  @RequirePermissions('payroll.create')
  async deleteAttendance(@Param('id') id: string, @Request() req: any) {
    const result = await this.hrService.deleteAttendance(id, req.user.id);
    return apiSuccess('Attendance deleted', result);
  }

  @Get('employees/:id/attendance')
  @RequirePermissions('payroll.view')
  async getEmployeeAttendance(@Param('id') id: string, @Query() params: any) {
    const result = await this.hrService.getAttendance({ ...params, employeeId: id });
    return apiSuccess('Employee attendance records retrieved', result.data, result.meta);
  }

  // =========================================================================
  // LEAVE REQUESTS
  // =========================================================================

  @Get('leaves')
  @RequirePermissions('payroll.view')
  async getLeaveRequests(@Query() params: any) {
    const result = await this.hrService.getLeaveRequests(params);
    return apiSuccess('Leave requests retrieved', result.data, result.meta);
  }

  @Post('leaves')
  @RequirePermissions('payroll.create')
  async createLeaveRequest(@Body() data: CreateLeaveRequestDto, @Request() req: any) {
    const result = await this.hrService.createLeaveRequest(data, req.user.id);
    return apiSuccess('Leave request created', result);
  }

  @Get('leaves/:id')
  @RequirePermissions('payroll.view')
  async getLeaveRequest(@Param('id') id: string) {
    const result = await this.hrService.getLeaveRequest(id);
    return apiSuccess('Leave request retrieved', result);
  }

  @Patch('leaves/:id')
  @RequirePermissions('payroll.create')
  async updateLeaveRequest(@Param('id') id: string, @Body() data: UpdateLeaveRequestDto, @Request() req: any) {
    const result = await this.hrService.updateLeaveRequest(id, data, req.user.id);
    return apiSuccess('Leave request updated', result);
  }

  @Post('leaves/:id/approve')
  @RequirePermissions('payroll.approve')
  async approveLeaveRequest(@Param('id') id: string, @Request() req: any) {
    const result = await this.hrService.approveLeaveRequest(id, req.user.id);
    return apiSuccess('Leave request approved', result);
  }

  @Post('leaves/:id/reject')
  @RequirePermissions('payroll.approve')
  async rejectLeaveRequest(@Param('id') id: string, @Body() data: RejectLeaveRequestDto, @Request() req: any) {
    const result = await this.hrService.rejectLeaveRequest(id, data, req.user.id);
    return apiSuccess('Leave request rejected', result);
  }

  @Post('leaves/:id/cancel')
  @RequirePermissions('payroll.create')
  async cancelLeaveRequest(@Param('id') id: string, @Request() req: any) {
    const result = await this.hrService.cancelLeaveRequest(id, req.user.id);
    return apiSuccess('Leave request cancelled', result);
  }

  @Delete('leaves/:id')
  @RequirePermissions('payroll.update')
  async deleteLeaveRequest(@Param('id') id: string, @Request() req: any) {
    const result = await this.hrService.deleteLeaveRequest(id, req.user.id);
    return apiSuccess('Leave request deleted', result);
  }
}
