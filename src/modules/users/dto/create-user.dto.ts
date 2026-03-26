import { IsEmail, IsEnum, IsString, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsEnum(['tutor', 'parent'])
  role: string;

  @IsOptional()
  phoneNumber?: string;

  // For parents, you can list their children here
  @IsOptional()
  childrenNames?: string[];
}