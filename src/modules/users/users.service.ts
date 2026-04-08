import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  // 1. ONBOARD: Handles the new form fields + JWT generation
  async onboardUser(dto: any) {
    const email = dto.parentEmail?.toLowerCase() || dto.email?.toLowerCase();
    
    const exists = await this.userModel.findOne({ email });
    if (exists) throw new ConflictException('This email is already registered.');

    const hashedPassword = await bcrypt.hash('DreamBox2026!', 10);

    const newUser = await this.userModel.create({
      ...dto,
      email, 
      password: hashedPassword,
      isRegistrationPaid: false,
      subscriptionStatus: 'inactive',
    });

    const payload = { email: newUser.email, sub: newUser._id, role: newUser.role };
    const token = this.jwtService.sign(payload);

    return {
      user: newUser,
      access_token: token,
    };
  }

  // 2. READ ONE: Used for the Dashboard status check
  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  // 3. READ ALL: Admin view
  async findAllUsers() { 
    return this.userModel.find().exec(); 
  }

  // 4. RESTORED: Find by School
  async findBySchool(schoolName: string) {
    return this.userModel.find({ schoolName, role: 'student' }).exec();
  }

  // 5. UPDATE: General updates
  async update(id: string, updateData: any) {
    return this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  // 6. RESTORED: Delete User
  async deleteUser(id: string) { 
    return this.userModel.findByIdAndDelete(id).exec(); 
  }

  // 7. APPROVE: The Moniepoint/OPay Unlock
  async approveUser(id: string) {
    return this.userModel.findByIdAndUpdate(
      id,
      { isRegistrationPaid: true, subscriptionStatus: 'active' },
      { new: true }
    ).exec();
  }

  async findUserByEmail(email: string) {
    // We use .select('+password') because the schema hides it by default
    return this.userModel.findOne({ email: email.toLowerCase() }).select('+password').exec();
  }
}