import { IsString, IsOptional, IsEmail, MinLength } from 'class-validator';

export class UpdateSchoolDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  schoolName?: string;

  @IsOptional()
  @IsString()
  motto?: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;
}