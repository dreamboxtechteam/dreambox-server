import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin') // Entire controller is Admin-only
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Handles GET /admin/users?role=tutor OR student
  @Get('users')
  async getDropdownUsers(@Query('role') role: string) {
    return this.adminService.findUsersByRole(role);
  }

  // The Magic Endpoint
  @Post('assign-student')
  async assignStudent(@Body() body: { tutorId: string; studentId: string }) {
    return this.adminService.linkTutorAndStudent(body.tutorId, body.studentId);
  }

  @Post('assign-school')
  async assignSchool(@Body() body: { tutorId: string; schoolName: string }) {
    return this.adminService.linkTutorToSchool(body.tutorId, body.schoolName);
  }
}