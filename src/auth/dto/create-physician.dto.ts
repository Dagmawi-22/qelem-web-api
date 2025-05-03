import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsArray,
  IsUUID,
  ArrayNotEmpty,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePhysicianDto {
  @ApiProperty({
    description: 'The specialization of the physician',
    example: 'Cardiology',
    required: false,
  })
  @IsOptional()
  @IsString()
  specialization?: string;

  @ApiProperty({
    description: 'The first name of the physician',
    example: 'Abebe',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'The last name of the physician',
    example: 'Kebede',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Array of category IDs (UUIDs) associated with the physician',
    example: ['hweiufh-234fdsf-dvdsf-12341'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayNotEmpty({
    message: 'categoryIds array should not be empty if provided.',
  })
  @MaxLength(3, {
    message: 'A maximum of 3 category IDs can be provided.',
  })
  categoryIds?: string[];

  @ApiProperty({
    description: 'The qualifications of the physician',
    example:
      'MD from Johns Hopkins University, Board Certified in Internal Medicine',
    required: false,
  })
  @IsOptional()
  @IsString()
  qualifications?: string;

  @ApiProperty({
    description: 'Years of experience',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0, { message: 'Years of experience must be a positive number' })
  @Max(100, { message: 'Years of experience cannot exceed 100' })
  experience?: number;

  @ApiProperty({
    description: 'user id ofthe patient',
    example: '42141-fwefwe-4124f-wefe',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  userId?: string;

  @ApiProperty({
    description: 'Professional biography',
    example: 'Dr. Smith has been practicing cardiology for over 10 years...',
    required: false,
  })
  @IsOptional()
  @IsString()
  biography?: string;

  @ApiProperty({
    description: 'Medical license number',
    example: 'MD12345678',
    required: false,
  })
  @IsOptional()
  @IsString()
  licenseNumber?: string;
}
