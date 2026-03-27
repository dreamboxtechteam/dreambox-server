import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true }) fullName: string;
  @Prop({ unique: true, required: true }) email: string;
  @Prop({ required: true, select: false }) password: string;
  @Prop({ enum: ['admin', 'tutor', 'parent'], default: 'parent' }) role: string;
  @Prop({ default: true }) mustChangePassword: boolean;
}
export const UserSchema = SchemaFactory.createForClass(User);