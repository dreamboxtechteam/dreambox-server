import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async onboardUser(dto: CreateUserDto & { password?: string, role?: string }) {
    const exists = await this.userModel.findOne({ email: dto.email });
    if (exists) throw new ConflictException('This email is already registered.');

    const passwordToHash = dto.password || 'ChangeMe2026!';
    const hashedPassword = await bcrypt.hash(passwordToHash, 10);

    return this.userModel.create({
      ...dto,
      password: hashedPassword,
      mustChangePassword: dto.role !== 'admin',
      isRegistrationPaid: false, 
      subscriptionStatus: 'inactive',
    });
  }

  async findUserByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async findAllUsers() { return this.userModel.find().exec(); }

  async findBySchool(schoolName: string) {
    return this.userModel.find({ schoolName, role: 'student' }).exec();
  }

  async update(id: string, updateData: any) {
    return this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async deleteUser(id: string) { return this.userModel.findByIdAndDelete(id).exec(); }

  // Manual Approval for the 20k Registration
  async approveUser(id: string) {
    return this.userModel.findByIdAndUpdate(
      id,
      { 
        isRegistrationPaid: true, 
        subscriptionStatus: 'active' // Sets them to active upon registration
      },
      { new: true }
    ).exec();
  }
}