import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Club extends Document {
  @Prop({ required: true })
  name!: string; // e.g., "Little Treasures - Leggo Club"

  @Prop({ required: true })
  schoolName!: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  schoolAdminId!: Types.ObjectId; // The person who signed up the school

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  tutorId?: Types.ObjectId; // Assigned later (e.g., Nuel)

  @Prop([{ type: Types.ObjectId, ref: 'User' }])
  studentList!: Types.ObjectId[]; // Array of registered children

  @Prop({ required: true })
  subject!: string; // "Leggo", "Robotics", etc.

  @Prop({ required: true })
  schedule!: string; // "Thursdays at 2:00 PM"

  @Prop({ 
    enum: ['pending_tutor', 'tutor_assigned', 'active', 'completed'], 
    default: 'pending_tutor' 
  })
  status!: string;

  @Prop({ type: Number })
  studentLimit?: number;
}

export const ClubSchema = SchemaFactory.createForClass(Club);