import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // This runs automatically when the server starts
  async onModuleInit() {
    const adminExists = await this.userModel.findOne({ role: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('LagosAdmin2026!', 10);
      await this.userModel.create({
        fullName: 'School Administrator',
        email: 'admin@dreambox.com',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('✅ Admin Seeded: admin@dreambox.com / LagosAdmin2026!');
    }
  }

  async findUserByEmail(email: string) {
    // .select('+password') is required because we hid it in the schema
    return this.userModel.findOne({ email }).select('+password').exec();
  }
}