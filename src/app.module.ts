import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { SchoolModule } from './modules/school/school.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),
    UsersModule,
    SchoolModule,
    AuthModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com', // Or your provider
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER, // e.g. academy@gmail.com
          pass: process.env.EMAIL_PASS, // Your App Password
        },
      },
    }),
  ],
})
export class AppModule {} 