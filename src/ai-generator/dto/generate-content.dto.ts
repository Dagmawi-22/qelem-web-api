import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

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
    enumName: 'ContentType',
    description: 'Type of content to generate',
    example: ContentType.EXAM,
  })
  @IsEnum(ContentType)
  type: ContentType;

  @ApiPropertyOptional({
    enum: DifficultyLevel,
    enumName: 'DifficultyLevel',
    description: 'Difficulty level of the content',
    example: DifficultyLevel.MEDIUM,
    default: DifficultyLevel.MEDIUM,
  })
  @IsOptional()
  @IsEnum(DifficultyLevel)
  difficulty: DifficultyLevel = DifficultyLevel.MEDIUM;

  @ApiPropertyOptional({
    type: Number,
    description: 'Number of items to generate (5-20)',
    example: 10,
    minimum: 5,
    maximum: 20,
    default: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(20)
  @Type(() => Number)
  @Transform(({ value }) => (value ? parseInt(value, 10) : 10))
  count: number = 10;
}
