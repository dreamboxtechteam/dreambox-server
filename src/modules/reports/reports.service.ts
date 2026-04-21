import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report } from './schemas/report.schema';

@Injectable()
export class ReportsService {
  constructor(@InjectModel(Report.name) private reportModel: Model<Report>) {}

  async createReport(data: any, tutorId: string) {
    const newReport = new this.reportModel({
      ...data,
      tutorId, // Automatically use the ID of the logged-in Tutor
    });
    return newReport.save();
  }

  async findByStudent(studentId: string) {
    return this.reportModel
      .find({ studentId })
      .sort({ date: -1 }) // Sort by the report date descending
      .exec();
  }
}