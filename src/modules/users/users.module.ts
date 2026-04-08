import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt'; // 👈 1. Import this
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    // 👈 2. Add this configuration block
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'DreamBoxSecret2026', 
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Exporting so AuthModule can still use findUserByEmail
})
export class UsersModule {}