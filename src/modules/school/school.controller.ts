import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { SchoolService } from './school.service';
import { UpdateSchoolDto } from './dto/update-school.dto';

@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Get('details')
  async getSchoolDetails() {
    return this.schoolService.getSettings();
  }

  
  @Patch('update')
async updateSchool(@Body() updateDto: UpdateSchoolDto) {
  return this.schoolService.updateSettings(updateDto);
}
}