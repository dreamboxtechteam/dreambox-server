import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 1. CREATE: Onboard Tutors or Parents from your paper records
  @Post('onboard')
  async onboard(@Body() createUserDto: CreateUserDto) {
    return this.usersService.onboardUser(createUserDto);
  }

  // 2. READ: Get a list of everyone in the school
  @Get('all')
  async findAll() {
    return this.usersService.findAllUsers();
  }

  // 3. READ ONE: Get a specific user's details
  @Get(':id')
  async findOne(@Param('id') id: string) {
    // Note: You can add a findById method in the service if needed
    return this.usersService.updateUser(id, {}); 
  }

  // 4. UPDATE: Fix typos in names or change emails
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.usersService.updateUser(id, updateData);
  }

  // 5. DELETE: Remove a user from the system
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}