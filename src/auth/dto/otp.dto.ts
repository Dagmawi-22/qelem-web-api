import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OTPType } from '@prisma/client';

/**
 * DTOs for OTP operations:
 * - RequestOtpDto: For requesting an OTP to be sent
 * - VerifyOtpDto: For verifying an OTP that was received
 */

export class RequestOtpDto {
  @ApiProperty({
    description: 'The email to send OTP to',
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
    description: 'The phone number to send OTP to',
    example: '+15551234567',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be in E.164 format (e.g. +15551234567)',
  })
  phoneNumber?: string;

  @ApiProperty({
    description: 'The type of OTP to generate',
    enum: OTPType,
    example: 'PHONE_VERIFICATION',
  })
  @IsNotEmpty()
  @IsEnum(OTPType, {
    message:
      'OTP type must be one of: EMAIL_VERIFICATION, PASSWORD_RESET, PHONE_VERIFICATION',
  })
  type: OTPType;
}

export class VerifyOtpDto {
  @ApiProperty({
    description: 'User ID',
    example: 'quiwfhu-fqwfui-21efwq-',
  })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'The OTP code',
    example: '123456',
  })
  @IsNotEmpty()
  @IsNumberString()
  @Length(6, 6, {
    message: 'OTP must be exactly 6 digits',
  })
  code: string;
}
