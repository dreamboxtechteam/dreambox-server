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

  async onboardUser(dto: any) {
    const email = dto.parentEmail?.toLowerCase() || dto.email?.toLowerCase();

    const exists = await this.userModel.findOne({ email });
    if (exists) throw new ConflictException('This email is already registered.');

    const hashedPassword = await bcrypt.hash(dto.password || 'DreamBox2026!', 10);

    const newUser = await this.userModel.create({
      ...dto,
      email,
      password: hashedPassword,
      isRegistrationPaid: dto.role === 'tutor' ? true : false,
      subscriptionStatus: dto.role === 'tutor' ? 'active' : 'inactive',
    });

    // --- TRIGGER ROLE-BASED EMAIL ---
    try {
      if (newUser.role === 'tutor') {
        await this.sendTutorWelcomeEmail(newUser);
      } else {
        await this.sendStudentWelcomeEmail(newUser);
      }
    } catch (error) {
      console.error('Email failed to send:', error);
    }

    const payload = { email: newUser.email, sub: newUser._id, role: newUser.role };
    const token = this.jwtService.sign(payload);

    return {
      user: newUser,
      access_token: token,
    };
  }

  // --- RESTORED: YOUR EXACT STUDENT MAIL ---
  private async sendStudentWelcomeEmail(user: any) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: `Welcome to the Laboratory, ${user.fullName.split(' ')[0]}! 🚀`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px;">
          <h2 style="color: #6c5ce7;">Dreambox Academy</h2>
          <p>Hi ${user.fullName},</p>
          <p>Welcome to the Dreambox Academy family! We are thrilled to have your child join our global community of young creators and thinkers.</p>
          <p>At Dreambox, we believe education should be an adventure. Whether your child is starting their journey in our Early Years Literacy program or diving into <b>${user.enrolledSubjects?.join(', ') || 'Robotics and STEM'}</b>, they are now part of a "Virtual Laboratory" designed to prepare them for the future.</p>
          
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
            <p><b>Here are your next steps:</b></p>
            <ul>
              <li><b>Access the Dashboard:</b> Log in at <a href="https://dreamboxacademy.com">dreamboxacademy.com</a> to view ${user.fullName.split(' ')[0]}’s learning modules.</li>
              <li><b>The Learning Hub:</b> Our 2026 Virtual School schedule is now active. Check the "Mission Control" section for class times.</li>
              <li><b>Get Support:</b> If you have questions about our curriculum or technical setup, just reply to this email.</li>
            </ul>
          </div>
          <p>We can't wait to see what ${user.fullName.split(' ')[0]} will create!</p>
          <p>Onward,<br><b>The Dreambox Team</b></p>
          <hr />
          <p style="font-size: 12px; color: #999;">Lagos | London | Houston | Toronto</p>
        </div>
      `,
    });
  }

  private async sendTutorWelcomeEmail(user: any) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: `Welcome to the Faculty, Professor ${user.fullName.split(' ')[0]}! 🧪`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px;">
          <h2 style="color: #00b894;">Dreambox Faculty</h2>
          <p>Hi ${user.fullName},</p>
          <p>Welcome to the Laboratory! We are excited to have your expertise in <b>${user.specialization || 'STEM'}</b>.</p>
          <p><b>Next Steps:</b> Please log in to view your roster and schedule.</p>
          <p>Best regards,<br><b>The Dreambox Team</b></p>
          <hr />
          <p style="font-size: 12px; color: #999;">Lagos | London | Houston | Toronto</p>
        </div>`,
    });
  }

  // --- CORE SYSTEM METHODS ---
  async findById(id: string) { return this.userModel.findById(id).exec(); }
  async findAllUsers() { return this.userModel.find().exec(); }
  async findBySchool(schoolName: string) {
    return this.userModel.find({ schoolName, role: 'student' }).exec();
  }
  async update(id: string, updateData: any) {
    return this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }
  async deleteUser(id: string) { return this.userModel.findByIdAndDelete(id).exec(); }
  async approveUser(id: string) {
    return this.userModel.findByIdAndUpdate(
      id,
      { isRegistrationPaid: true, subscriptionStatus: 'active' },
      { new: true },
    ).exec();
  }
  async findUserByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase() }).select('+password').exec();
  }
}