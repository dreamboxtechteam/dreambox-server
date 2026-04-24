import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard'; // Ensure this path is correct

@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  // ADD THIS ROUTE HERE
  @UseGuards(JwtAuthGuard)
  @Post('initialize')
  async initializeClub(@Body() body: any) {
    // We expect the frontend to send { adminDto, clubDetails }
    const club = await this.clubsService.initializeSchoolClub(
      body.adminDto, 
      body.clubDetails
    );
    
    return {
      success: true,
      message: 'Club initialization successful',
      data: club,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':clubId/assign-tutor')
  async assignTutor(
    @Param('clubId') clubId: string, 
    @Body('tutorId') tutorId: string
  ) {
    const club = await this.clubsService.update(clubId, { 
      tutorId, 
      status: 'tutor_assigned' 
    });
    
    return {
      success: true,
      message: `Tutor assigned to ${club?.name}`,
      data: club
    };
  }
}