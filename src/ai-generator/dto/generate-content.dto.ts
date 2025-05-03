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
  @IsEnum(ContentType)
  type: ContentType;

  @IsOptional()
  @IsEnum(DifficultyLevel)
  difficulty?: DifficultyLevel;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  count?: number;
}
