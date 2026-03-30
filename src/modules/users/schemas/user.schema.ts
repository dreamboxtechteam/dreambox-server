import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true }) fullName: string;
  @Prop({ unique: true, required: true }) email: string;
  @Prop({ required: true, select: false }) password: string;
  @Prop({ enum: ['admin', 'school_admin', 'tutor', 'student'], default: 'student' }) role: string;
  @Prop({ default: true }) mustChangePassword: boolean;

  // --- Payment & Access Control ---
  @Prop({ default: false }) isRegistrationPaid: boolean; 
  @Prop({ enum: ['active', 'inactive', 'expired'], default: 'inactive' }) subscriptionStatus: string;
  @Prop() subscriptionExpiryDate: Date;

  // --- School & Academic Data ---
  @Prop() schoolName: string; 
  @Prop({ type: [String] }) enrolledSubjects: string[]; 
  @Prop() gradeLevel: string;
}
export const UserSchema = SchemaFactory.createForClass(User);