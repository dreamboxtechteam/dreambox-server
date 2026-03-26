import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { School } from './schemas/school.schema';

@Injectable()
export class SchoolService {
  constructor(@InjectModel(School.name) private schoolModel: Model<School>) {}

  // Get the single school record (Dashboard view)
  async getSettings() {
    let school = await this.schoolModel.findOne();
    if (!school) {
      // Create a default one if none exists
      school = await this.schoolModel.create({ schoolName: 'My Virtual School' });
    }
    return school;
  }

  // Update school info (Admin action)
  async updateSettings(updateData: any) {
    return this.schoolModel.findOneAndUpdate({}, updateData, { new: true });
  }
}