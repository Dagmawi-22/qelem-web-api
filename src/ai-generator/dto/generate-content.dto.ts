import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';

export enum ContentType {
  EXAM = 'exam',
  FLASHCARD = 'flashcard',
}

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export class GenerateContentDto {
  @ApiProperty({
    enum: ContentType,
    description: 'Type of content to generate',
    example: ContentType.EXAM,
  })
  @IsEnum(ContentType)
  type: ContentType;

  @ApiPropertyOptional({
    enum: DifficultyLevel,
    description: 'Difficulty level of the content',
    example: DifficultyLevel.MEDIUM,
  })
  @IsOptional()
  @IsEnum(DifficultyLevel)
  difficulty?: DifficultyLevel;

  @ApiPropertyOptional({
    type: Number,
    minimum: 1,
    maximum: 50,
    description: 'Number of items to generate (1–50)',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  count?: number;
}
