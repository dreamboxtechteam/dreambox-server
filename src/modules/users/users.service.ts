import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './schemas/user.schema';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  // 1. ONBOARD: Handles the new form fields + JWT generation
  async onboardUser(dto: any) {
    const email = dto.parentEmail?.toLowerCase() || dto.email?.toLowerCase();

    const exists = await this.userModel.findOne({ email });
    if (exists)
      throw new ConflictException('This email is already registered.');

    const hashedPassword = await bcrypt.hash('DreamBox2026!', 10);

    const newUser = await this.userModel.create({
      ...dto,
      email,
      password: hashedPassword,
      isRegistrationPaid: false,
      subscriptionStatus: 'inactive',
    });

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `Welcome to the Academy, ${dto.fullName}!🚀`,
        template: './welcome', // If using templates, or use 'html' below
        html: `
          <div style="font-family: sans-serif; color: #333; max-width: 600px;">
            <h2 style="color: #6c5ce7;">Dreambox Academy</h2>
            <p>Hi ${dto.fullName},</p>
            <p>Welcome to the Dreambox Academy family! We are thrilled to have your child join our global community of young creators and thinkers.</p>
            <p>At Dreambox, we believe education should be an adventure. Whether your child is starting their journey in our Early Years Literacy program or diving into <b>${dto.enrolledSubjects?.join(', ') || 'Robotics and STEM'}</b>, they are now part of a "Virtual Laboratory" designed to prepare them for the future.</p>
            
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
              <p><b>Next Steps:</b></p>
              <ul>
                <li><b>Access the Dashboard:</b> Log in at <a href="https://dreamboxacademy.com">dreamboxacademy.com</a> to view modules.</li>
                <li><b>The Learning Hub:</b> Our 2026 Virtual School schedule is now active. Check "Mission Control" for class times.</li>
                <li><b>Get Support:</b> Reply to this email if you have questions.</li>
              </ul>
            </div>
            <p>We can't wait to see what they will create!</p>
            <p>Onward,<br><b>The Dreambox Team</b></p>
            <hr />
            <p style="font-size: 12px; color: #999;">Lagos | London | Houston | Toronto</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Email failed to send, but user was created:', error);
      // We don't crash the signup if the email fails
    }

    const payload = {
      email: newUser.email,
      sub: newUser._id,
      role: newUser.role,
    };
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
    return this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  // 6. RESTORED: Delete User
  async deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  // 7. APPROVE: The Moniepoint/OPay Unlock
  async approveUser(id: string) {
    return this.userModel
      .findByIdAndUpdate(
        id,
        { isRegistrationPaid: true, subscriptionStatus: 'active' },
        { new: true },
      )
      .exec();
  }

  async findUserByEmail(email: string) {
    // We use .select('+password') because the schema hides it by default
    return this.userModel
      .findOne({ email: email.toLowerCase() })
      .select('+password')
      .exec();
  }
}
