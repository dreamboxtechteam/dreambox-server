import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class School extends Document {
  @Prop({ required: true }) schoolName: string;
  @Prop() motto: string;
  @Prop() logoUrl: string;
  @Prop({ default: 'First Term' }) currentTerm: string;
  @Prop({ default: '2025/2026' }) academicSession: string;
}
export const SchoolSchema = SchemaFactory.createForClass(School);