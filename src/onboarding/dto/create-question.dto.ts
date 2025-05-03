import { QuestionType, UserRole } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  IsEnum,
  IsJSON,
} from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({ description: 'ID of the questionnaire this question belongs to', example: "uhfiquw-qiwg" })
  @IsString({ message: 'Questionnaire ID must be a string' })
  @IsNotEmpty({ message: 'Questionnaire ID is required' })
  questionnaireId: string;

  @ApiProperty({ description: 'Question text', example: 'What is your age?' })
  @IsString({ message: 'Question must be a string' })
  @IsNotEmpty({ message: 'Question is required' })
  question: string;

  @ApiPropertyOptional({ description: 'Additional description for the question', example: 'Age in years' })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiProperty({ enum: UserRole, description: 'User type (Physician or Patient)', example: UserRole.PHYSICIAN })
  @IsEnum(UserRole, { message: 'User role must be Physician or Patient' })
  userType: UserRole;

  @ApiProperty({ enum: QuestionType, description: 'Type of the question', example: QuestionType.MULTIPLE_CHOICE })
  @IsEnum(QuestionType, { message: 'Invalid question type' })
  @IsNotEmpty({ message: 'Question type is required' })
  type: QuestionType;

  @ApiPropertyOptional({ description: 'Indicates if the question is required', example: false, default: false })
  @IsBoolean({ message: 'isRequired must be a boolean' })
  @IsOptional()
  isRequired?: boolean;

  @ApiPropertyOptional({ description: 'Options for the question (JSON format)', example: '{"choices": ["Yes", "No"]}' })
  @IsOptional()
//   @IsJSON({ message: 'Options must be a valid JSON object' })
  options?: any;

  @ApiPropertyOptional({ description: 'Order index of the question', example: 2, default: 0 })
  @IsInt({ message: 'Order index must be an integer' })
  @Min(0, { message: 'Order index cannot be negative' })
  @IsOptional()
  orderIndex?: number;

  @ApiPropertyOptional({ description: 'ID of the question this question depends on', example: "fiwehfoi" })
  @IsOptional()
  @IsString({ message: 'DependsOnQuestionId must be a string' })
  dependsOnQuestionId?: string;

  @ApiPropertyOptional({ description: 'The answer value that triggers this question', example: 'Yes' })
  @IsOptional()
  @IsString({ message: 'DependsOnAnswerValue must be a string' })
  dependsOnAnswerValue?: string;

  constructor(partial?: Partial<CreateQuestionDto>) {
    Object.assign(this, partial);
    this.isRequired = this.isRequired ?? false; // Default to false if not provided
    this.orderIndex = this.orderIndex ?? 0; // Default to 0 if not provided
  }
}
