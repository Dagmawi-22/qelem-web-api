import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateRatingDto {
  @ApiProperty({
    example: 4,
    minimum: 1,
    maximum: 5,
    description: 'Rating value from 1 (worst) to 5 (best)',
  })
  @IsInt({ message: 'Rating must be an integer value.' })
  @Min(1, { message: 'Minimum rating value is 1.' })
  @Max(5, { message: 'Maximum rating value is 5.' })
  rating: number;

  @ApiProperty({
    example: 'The doctor was very attentive and helpful.',
    description: 'Optional review text describing the user experience',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Review must be a string.' })
  review?: string;

  @ApiProperty({
    example: '7d942478-94d4-4cc5-91c3-bf902f78b779',
    description: 'UUID of the patient who is giving the rating',
  })
  @IsString({ message: 'Patient ID must be a string.' })
  @IsUUID(undefined, { message: 'Patient ID must be a valid UUID.' })
  patientId: string;

  @ApiProperty({
    example: '395f27cb-9c6e-4297-8889-5eab80aeb8dc',
    description: 'UUID of the physician being rated',
  })
  @IsString({ message: 'Physician ID must be a string.' })
  @IsUUID(undefined, { message: 'Physician ID must be a valid UUID.' })
  physicianId: string;
}
