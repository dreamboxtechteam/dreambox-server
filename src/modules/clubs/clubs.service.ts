import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Club } from './schemas/club.schema';

@Injectable()
export class ClubsService {
  constructor(
    @InjectModel(Club.name) private readonly clubModel: Model<Club>,
  ) {}

  async initializeSchoolClub(adminDto: any, clubDetails: any) {
    const newClub = new this.clubModel({
      name: `${adminDto.schoolName} - ${clubDetails.subject} Club`,
      schoolName: adminDto.schoolName,
      schoolAdminId: adminDto._id, // Changed 'id' to '_id' for MongoDB
      subject: clubDetails.subject,
      schedule: `${clubDetails.date} at ${clubDetails.time}`,
      studentLimit: clubDetails.numberOfChildren,
      tutorId: null,
      status: 'pending_tutor',
    });
    return newClub.save();
  }

  // THIS WAS MISSING: The update method for assigning tutors
  async update(id: string, updateData: any) {
    return this.clubModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  // To help Nuel see his classes
  async getTutorAssignments(tutorId: string) {
    return this.clubModel.find({ tutorId }).exec();
  }
}