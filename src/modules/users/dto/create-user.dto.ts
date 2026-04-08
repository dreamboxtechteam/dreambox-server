import { IsEmail, IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  parentEmail: string; // The primary email from your new form

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  age?: string;

  @IsString()
  @IsOptional()
  currentClass?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  favouriteCharacter?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  enrolledSubjects?: string[];

  @IsString()
  @IsOptional()
  schoolName?: string;

  @IsString()
  @IsOptional()
  role?: string; // Default is 'student' in schema, but good to have here
}