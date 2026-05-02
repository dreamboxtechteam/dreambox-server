import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: any) {}

  @Post('create')
  @Roles('tutor')
  async createReport(@Request() req, @Body() body: { studentId: string, content: string }) {
    // tutorId is pulled automatically from the token (req.user.sub)
    return this.reportsService.create({
      ...body,
      tutorId: req.user.sub,
      date: new Date(),
    });
  }

  @Get('my-reports')
  @Roles('student')
  async getStudentReports(@Request() req) {
    return this.reportsService.findByStudent(req.user.sub);
  }
}