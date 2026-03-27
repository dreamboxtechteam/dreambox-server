import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // Manual Creation (Used for First Admin or Onboarding)
  async onboardUser(dto: CreateUserDto & { password?: string, role?: string }) {
    const exists = await this.userModel.findOne({ email: dto.email });
    if (exists) throw new ConflictException('This email is already registered.');

    // Use provided password or the default temporary one
    const passwordToHash = dto.password || 'ChangeMe2026!';
    const hashedPassword = await bcrypt.hash(passwordToHash, 10);

    return this.userModel.create({
      ...dto,
      password: hashedPassword,
      // If it's a manual onboard, they must change password. 
      // If it's the first admin, set to false.
      mustChangePassword: dto.role !== 'admin', 
    });
  }

  async findUserByEmail(email: string) {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async findAllUsers() { return this.userModel.find().exec(); }
  async updateUser(id: string, data: any) { return this.userModel.findByIdAndUpdate(id, data, { new: true }).exec(); }
  async deleteUser(id: string) { return this.userModel.findByIdAndDelete(id).exec(); }
}