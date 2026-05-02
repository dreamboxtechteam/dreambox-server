import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../modules/users/schemas/user.schema'; // 👈 Ensure this path is correct

@Injectable() // 👈 Make sure this has the ()
export class AdminService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findUsersByRole(role: string) {
    return this.userModel.find({ role }).select('_id fullName email').exec();
  }

  async linkTutorAndStudent(tutorId: string, studentId: string) {
    return this.userModel.findByIdAndUpdate(
      studentId,
      { assignedTutor: tutorId },
      { new: true }
    );
  }

  async linkTutorToSchool(tutorId: string, schoolName: string) {
    return this.userModel.findByIdAndUpdate(
      tutorId,
      { school: schoolName },
      { new: true }
    );
  }
}