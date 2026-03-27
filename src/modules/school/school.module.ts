import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';
import { School, SchoolSchema } from './schemas/school.schema';

@Module({
  imports: [
    // Register the Schema here
    MongooseModule.forFeature([{ name: School.name, schema: SchoolSchema }])
  ],
  controllers: [SchoolController], // ✅ Controllers go here
  providers: [SchoolService],     // ✅ Services go here
  exports: [SchoolService],       // Export if other modules need it
})
export class SchoolModule {}