import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsDate,
  IsNotEmpty,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InterestedIn } from '@prisma/client';

export class CreatePatientDto {
  @ApiProperty({
    description: 'The date of birth of the patient',
    example: '1990-01-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirth?: Date;

    @ApiProperty({
      description: 'The type of headler user is interested in',
      enum: InterestedIn,
      example: InterestedIn.THERAPISTS,
      default: InterestedIn.THERAPISTS,
    })
    @IsOptional()
    @IsEnum(InterestedIn, {
      message: 'InterestedIn must be one of: THERAPISTS, SPIRITUAL_HEALERS',
    })
    interestedIn?: InterestedIn;

  @ApiProperty({
    description: 'The gender of the patient',
    example: 'Male',
    required: false,
  })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({
    description: 'The anonumous name of the patient',
    example: 'ayele43',
    required: false,
  })
  @IsOptional()
  @IsString()
  anonymousName?: string;

  @ApiProperty({
    description: 'Whether the patient is anonymous',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;

  @ApiProperty({
    description: 'The first name of the patient',
    example: 'Abebe',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'The last name of the patient',
    example: 'Kebede',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'The address of the patient',
    example: '123 Main St, Anytown, USA',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'user id ofthe patient',
    example: '42141-fwefwe-4124f-wefe',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  userId?: string;

  @ApiProperty({
    description: 'Emergency contact information',
    example: 'Jane Doe, +15551234567, Relationship: Spouse',
    required: false,
  })
  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @ApiProperty({
    description: 'Brief medical history',
    example: 'No major health issues. Allergic to penicillin.',
    required: false,
  })
  @IsOptional()
  @IsString()
  medicalHistory?: string;
}
