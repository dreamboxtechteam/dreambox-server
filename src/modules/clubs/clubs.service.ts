async initializeSchoolClub(adminDto: any, clubDetails: any) {
  // 1. Create the School Admin User via the UsersService
  // (Assuming you've linked the services)
  
  // 2. Create the Club record
  const newClub = new this.clubModel({
    name: `${adminDto.schoolName} - ${clubDetails.subject} Club`,
    schoolName: adminDto.schoolName,
    schoolAdminId: adminDto.id,
    subject: clubDetails.subject,
    schedule: `${clubDetails.date} at ${clubDetails.time}`,
    studentLimit: clubDetails.numberOfChildren, // New field to track capacity
    tutorId: null, // Initially null until DreamBox Admin assigns someone
  });
  
  return newClub.save();
}