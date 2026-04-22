// For DreamBox Super Admin only
@UseGuards(JwtAuthGuard, RolesGuard) // Ensure only you can do this
@Patch(':clubId/assign-tutor')
async assignTutor(@Param('clubId') clubId: string, @Body('tutorId') tutorId: string) {
  const club = await this.clubsService.update(clubId, { tutorId });
  return {
    success: true,
    message: `Tutor assigned to ${club.name}`,
    data: club
  };
}