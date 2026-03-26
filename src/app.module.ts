import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { SchoolModule } from './modules/school/school.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    // 1. Load Environment Variables (.env)
    ConfigModule.forRoot({
      isGlobal: true, 
    }),

    // 2. Connect to MongoDB using the URI from .env
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),

    // 3. School Specific Modules
    UsersModule,
    SchoolModule,
    AuthModule,
  ],
})
export class AppModule {}