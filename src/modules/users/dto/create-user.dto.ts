import { IsEmail, IsString, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsString() fullName: string;
  @IsEmail() email: string;
  @IsEnum(['tutor', 'parent']) role: string;
}