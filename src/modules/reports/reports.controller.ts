import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('submit')
  async submitReport(@Body() body: any, @Request() req: any) {
    // req.user.userId is the ID extracted from the Tutor's JWT
    const report = await this.reportsService.createReport(body, req.user.userId);
    return {
      success: true,
      data: report,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('student/:studentId')
  async getStudentReports(@Param('studentId') studentId: string) {
    const reports = await this.reportsService.findByStudent(studentId);
    return {
      success: true,
      data: reports,
    };
  }
}