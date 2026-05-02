import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User, UserSchema } from '../modules/users/schemas/user.schema';

@Module({
  imports: [
    // This allows the AdminService to talk to the User database
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService]
})
export class AdminModule {}