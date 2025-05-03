import { UserRole } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateOnboardingDto {
  @ApiProperty({ description: 'Title of the onboarding questionnaire', example: 'User Introduction' })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @ApiPropertyOptional({ description: 'Description of the onboarding questionnaire', example: 'This is an introductory questionnaire.' })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiProperty({ enum: UserRole, description: 'User role associated with the questionnaire', example: UserRole.ADMIN })
  @IsEnum(UserRole, { message: 'User role must be a valid enum value' })
  @IsNotEmpty({ message: 'User role is required' })
  userRole: UserRole;

  @ApiPropertyOptional({ description: 'Indicates if the questionnaire is active', example: true, default: true })
  @IsBoolean({ message: 'isActive must be a boolean' })
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Order index of the questionnaire', example: 1, default: 0 })
  @IsInt({ message: 'Order index must be an integer' })
  @Min(0, { message: 'Order index cannot be negative' })
  @IsOptional()
  orderIndex?: number;

  constructor(partial?: Partial<CreateOnboardingDto>) {
    Object.assign(this, partial);
    this.isActive = this.isActive ?? true;
    this.orderIndex = this.orderIndex ?? 0; 
  }
}
