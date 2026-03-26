import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({ unique: true, required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, select: false }) // 'select: false' protects password from being leaked in GET requests
  password: string;

  @Prop({ 
    type: String, 
    enum: ['admin', 'tutor', 'parent'], 
    default: 'parent' 
  })
  role: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: true })
  mustChangePassword: boolean; // Set to true for accounts created by Admin

  @Prop({ type: Object })
  metadata: {
    parentOf?: string[]; // Array of Student Names/IDs
    subject?: string;    // For Tutors
    phoneNumber?: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);