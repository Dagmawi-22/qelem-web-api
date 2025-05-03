import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnswerQuestionDto {
  @ApiProperty({
    description: 'The ID of the question being answered',
    example: '1',
  })
  @IsString({
    message: 'Question ID must be a valid number',
  })
  questionId: string;

  @ApiProperty({
    description: 'The answer provided for the question',
    example: 'Yes, I have experience with NestJS',
    type: String,
  })
  @IsString({
    message: 'Answer must be a string',
  })
  @IsNotEmpty({
    message: 'Answer cannot be empty',
  })
  answer: string;
}

export class SubmitQuestionnaireDto {
  @ApiProperty({
    description: 'The ID of the questionnaire being submitted',
    example: '5',
  })
  @IsString({
    message: 'Questionnaire ID must be a valid string',
  })
  questionnaireId: string;

  @ApiProperty({
    description: 'The ID of the user submitting the questionnaire',
    example: '42',
  })
  @IsString({
    message: 'User ID must be a valid string',
  })
  userId: string;

  @ApiProperty({
    description: 'Array of answers for the questionnaire questions',
    type: [AnswerQuestionDto],
    example: [
      {
        questionId: 1,
        answer: 'Yes, I have experience with NestJS',
      },
      {
        questionId: 2,
        answer: 'About 2 years of experience',
      },
    ],
  })
  @IsNotEmpty({
    message: 'Answers array cannot be empty',
  })
  answers: AnswerQuestionDto[];
}
