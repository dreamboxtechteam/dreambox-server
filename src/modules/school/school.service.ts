import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { School } from './schemas/school.schema';

@Injectable()
export class SchoolService {
  constructor(@InjectModel(School.name) private schoolModel: Model<School>) {}

  async getSettings() {
    let school = await this.schoolModel.findOne();
    if (!school) school = await this.schoolModel.create({ schoolName: 'Dreambox School' });
    return school;
  }

  async updateSettings(data: any) {
    return this.schoolModel.findOneAndUpdate({}, data, { new: true });
  }
}