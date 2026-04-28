import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RolesGuard } from '@/common/guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('onboard')
  async onboard(@Body() createUserDto: any) {
    return this.usersService.onboardUser(createUserDto);
  }

  @Patch(':id/approve-registration')
  async approveRegistration(@Param('id') id: string) {
    return this.usersService.approveUser(id);
  }


  @UseGuards( RolesGuard)
  @Get('all')
  async findAll(@Query('school') school?: string) {
    if (school) return this.usersService.findBySchool(school);
    return this.usersService.findAllUsers();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.usersService.update(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @UseGuards(RolesGuard)
  @Get('admin/stats')
  async getAdminStats() {
    const allUsers = await this.usersService.findAllUsers();
    
    return {
      totalStudents: allUsers.filter(u => u.role === 'student').length,
      totalTutors: allUsers.filter(u => u.role === 'tutor').length,
      pendingPayments: allUsers.filter(u => u.role === 'student' && !u.isRegistrationPaid).length,
      activeSubscriptions: allUsers.filter(u => u.subscriptionStatus === 'active').length,
      // Quick math: 20k per paid registration
      totalRevenue: allUsers.filter(u => u.isRegistrationPaid).length * 20000,
    };
  }
}