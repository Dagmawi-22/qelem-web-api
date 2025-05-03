import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreatePhysicianCategoryDto {
  @ApiProperty({
    description: 'The name of the physician category.',
    example: 'Cardiology',
    required: true,
  })
  @IsString({ message: 'Name should be a string.' })
  @IsNotEmpty({ message: 'Name is required and cannot be empty.' })
  name: string;

  @ApiProperty({
    description: 'A brief description of the physician category.',
    example: 'Specialists in heart diseases.',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: 'Description should be a string.' })
  description?: string;

  @ApiProperty({
    description: 'Indicates if the physician category is active.',
    example: true,
    required: true,
  })
  @IsBoolean({ message: 'Active should be a boolean value.' })
  @IsNotEmpty({ message: 'Active status is required.' })
  active: boolean;
}
