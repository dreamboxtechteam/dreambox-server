import { Injectable, OnModuleInit, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async onModuleInit() {
    const adminExists = await this.userModel.findOne({ role: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('LagosAdmin2026!', 10);
      await this.userModel.create({
        fullName: 'School Administrator',
        email: 'admin@dreambox.com',
        password: hashedPassword,
        role: 'admin',
        mustChangePassword: false,
      });
      console.log('✅ Admin Seeded');
    }
  }

  async findUserByEmail(email: string) {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async onboardUser(dto: CreateUserDto) {
    const exists = await this.userModel.findOne({ email: dto.email });
    if (exists) throw new ConflictException('Email already registered');
    const hashedPassword = await bcrypt.hash('ChangeMe2026!', 10);
    return this.userModel.create({ ...dto, password: hashedPassword, mustChangePassword: true });
  }

  async findAllUsers() { return this.userModel.find().exec(); }
  async updateUser(id: string, data: any) { return this.userModel.findByIdAndUpdate(id, data, { new: true }).exec(); }
  async deleteUser(id: string) { return this.userModel.findByIdAndDelete(id).exec(); }
}