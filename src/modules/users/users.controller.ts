import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Returns { user, access_token }
  @Post('onboard')
  async onboard(@Body() createUserDto: CreateUserDto) {
    return this.usersService.onboardUser(createUserDto);
  }

  // Admin hits this to unlock the 20k registration
  @Patch(':id/approve-registration')
  async approveRegistration(@Param('id') id: string) {
    return this.usersService.approveUser(id);
  }

  // Frontend calls this with ID from JWT to check "isRegistrationPaid"
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Get('all')
  async findAll(@Query('school') school?: string) {
    if (school) return this.usersService.findBySchool(school);
    return this.usersService.findAllUsers();
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