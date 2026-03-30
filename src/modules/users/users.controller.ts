import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('onboard')
  async onboard(@Body() createUserDto: CreateUserDto) {
    return this.usersService.onboardUser(createUserDto);
  }

  @Patch(':id/approve-registration')
  async approveRegistration(@Param('id') id: string) {
    return this.usersService.approveUser(id);
  }

  @Get('all')
  async findAll(@Query('school') school?: string) {
    if (school) return this.usersService.findBySchool(school);
    return this.usersService.findAllUsers();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // Path of least resistance: uses update with empty body to fetch
    return this.usersService.update(id, {}); 
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.usersService.update(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}