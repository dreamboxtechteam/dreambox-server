import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt'; 
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  // Registration + Auto-Login Token
  async onboardUser(dto: CreateUserDto & { password?: string, role?: string }) {
    const exists = await this.userModel.findOne({ email: dto.email });
    if (exists) throw new ConflictException('This email is already registered.');

    const passwordToHash = dto.password || 'ChangeMe2026!';
    const hashedPassword = await bcrypt.hash(passwordToHash, 10);

    const newUser = await this.userModel.create({
      ...dto,
      password: hashedPassword,
      mustChangePassword: dto.role !== 'admin',
      isRegistrationPaid: false,
      subscriptionStatus: 'inactive',
    });

    // Generate JWT so frontend can extract the ID
    const payload = { email: newUser.email, sub: newUser._id, role: newUser.role };
    const token = this.jwtService.sign(payload);

    return {
      user: newUser,
      access_token: token,
    };
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async approveUser(id: string) {
    return this.userModel.findByIdAndUpdate(
      id,
      { isRegistrationPaid: true, subscriptionStatus: 'active' },
      { new: true }
    ).exec();
  }

  async findAllUsers() { return this.userModel.find().exec(); }
  
  async findBySchool(schoolName: string) {
    return this.userModel.find({ schoolName, role: 'student' }).exec();
  }

  async update(id: string, updateData: any) {
    return this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async deleteUser(id: string) { return this.userModel.findByIdAndDelete(id).exec(); }
}