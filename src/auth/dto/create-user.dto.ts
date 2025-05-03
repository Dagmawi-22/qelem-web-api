import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  Matches,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserLang } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    description: 'The username of the user',
    example: 'johndoe123',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username must contain only letters, numbers, and underscores',
  })
  username?: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail(
    {},
    {
      message: 'Please provide a valid email address',
    },
  )
  email?: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '+15551234567',
    required: true,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be in E.164 format (e.g. +15551234567)',
  })
  phoneNumber?: string;

  @ApiProperty({
    description: 'Is the user anonymous?',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;

  @ApiProperty({
    description: 'The password for the user account',
    example: 'StrongP@ssw0rd',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password?: string;

  @ApiProperty({
    description: 'The role of the user',
    enum: UserRole,
    example: 'PATIENT',
    default: 'PATIENT',
  })
  @IsOptional()
  @IsEnum(UserRole, {
    message: 'Role must be one of: ADMIN, PATIENT, PHYSICIAN',
  })
  role?: UserRole;

  @ApiProperty({
    description: 'The language choice of the user',
    enum: UserLang,
    example: 'ENG',
    default: 'ENG',
  })
  @IsOptional()
  @IsEnum(UserLang, {
    message: 'Lang: ENG, AM',
  })
  lang?: UserLang;
}
