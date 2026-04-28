import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
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


  @UseGuards(JwtAuthGuard)
@Get('admin/:adminId')
async getAdminClubs(@Param('adminId') adminId: string, @Request() req: any) {
  // Security Check: Ensure the logged-in user is actually the admin they are asking for
  // Unless they are a Super Admin
  if (req.user.userId !== adminId && req.user.role !== 'super_admin') {
    throw new ForbiddenException('You do not have permission to view these clubs');
  }

  const clubs = await this.clubsService.getClubsByAdmin(adminId);
  
  // Format the data for the frontend guy
  return clubs.map(club => ({
    id: club._id,
    schoolName: club.schoolName,
    subject: club.subject,
    schedule: club.schedule,
    // If no tutor assigned, return "Unassigned"
    tutorName: (club.tutorId as any)?.fullName || 'Unassigned',
    status: club.status
  }));
}
}