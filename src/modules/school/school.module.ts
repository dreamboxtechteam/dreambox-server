import { Controller, Get, Patch, Body } from '@nestjs/common';
import { SchoolService } from './school.service';

@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Get()
  async getInfo() { return this.schoolService.getSettings(); }

  @Patch()
  async update(@Body() data: any) { return this.schoolService.updateSettings(data); }
}