import { QuestionType } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsInt,
  IsBoolean,
  MinLength,
  IsEnum,
} from 'class-validator';

export class UpdateQuestionDto {
  @ApiPropertyOptional({ description: 'Updated text for the question', example: 'What is your name?' })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Question text must be at least 3 characters long' })
  text?: string;

  @ApiPropertyOptional({ description: 'ID of the question this question depends on', example: 5 })
  @IsOptional()
  @IsInt({ message: 'DependsOnQuestionId must be an integer' })
  dependsOnQuestionId?: number;

  @ApiPropertyOptional({ 
    enum: QuestionType, 
    description: 'Updated question type (text, multiple_choice, yes_no)', 
    example: QuestionType.MULTIPLE_CHOICE 
  })
  @IsOptional()
  @IsEnum(QuestionType, { message: 'Type must be either text, multiple_choice, or yes_no' })
  type?: QuestionType;

  @ApiPropertyOptional({ description: 'Indicates if the question is required', example: true })
  @IsOptional()
  @IsBoolean({ message: 'Required must be a boolean value' })
  required?: boolean;
}
