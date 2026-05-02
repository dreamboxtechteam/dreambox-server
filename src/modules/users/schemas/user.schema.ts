import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true }) fullName: string;
  @Prop({ unique: true, required: true }) email: string; // Used for login
  @Prop() parentEmail: string; // Added from new form
  @Prop({ required: true, select: false }) password: string;
  @Prop({ enum: ['admin', 'school_admin', 'tutor', 'student'], default: 'student' }) role: string;
  
  // --- New Onboarding Fields ---
  @Prop() gender: string;
  @Prop() age: string;
  @Prop() currentClass: string;
  @Prop() country: string;
  @Prop() favouriteCharacter: string;
  @Prop({ type: [String] }) enrolledSubjects: string[];

  // --- Access Control ---
  @Prop({ default: false }) isRegistrationPaid: boolean;
  @Prop({ enum: ['active', 'inactive', 'expired'], default: 'inactive' }) subscriptionStatus: string;
  @Prop() subscriptionExpiryDate: Date;
  @Prop({ default: true }) mustChangePassword: boolean;
  @Prop() schoolName: string;

  // --- Tutor-specific ---
 @Prop() location: string;
@Prop() experience: string;
@Prop({ default: 'IGCSE English' }) specialization: string;

@Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
assignedTutor: string; // Used for Students

@Prop()
school: string; // Used for Tutors/Students



@Prop() schoolAddress: string;


}

export const UserSchema = SchemaFactory.createForClass(User);