import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Report extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  studentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  tutorId: Types.ObjectId;

  @Prop({ enum: ['introductory', 'monthly'], required: true })
  type: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  date: string; // Storing as ISO string as requested

  @Prop({ default: 'published' })
  status: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);