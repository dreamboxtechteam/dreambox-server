import { IsEmail, IsString, IsEnum, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString() 
  fullName: string;

  @IsEmail() 
  email: string;

  // UPDATE THIS LINE:
  @IsEnum(['admin', 'school_admin', 'tutor', 'student'], {
    message: 'role must be admin, school_admin, tutor, or student',
  })
  role: string;

  @IsOptional() 
  @IsString() 
  schoolName?: string;

  @IsOptional() 
  @IsString() 
  gradeLevel?: string;

  @IsOptional() 
  @IsString() 
  password?: string;
}