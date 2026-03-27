import { IsEmail, IsString, IsEnum, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsEnum(['admin', 'tutor', 'parent'], {
    message: 'role must be either admin, tutor, or parent',
  })
  role: string;

  @IsOptional()
  @IsString()
  password?: string; // Optional so you can set it for the first Admin
}