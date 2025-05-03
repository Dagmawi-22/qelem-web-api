import { OmitType } from '@nestjs/swagger';
import { CreateQuestionDto } from './create-question.dto';

export class CreateQuestionWithoutQuestionnaireDto extends OmitType(
  CreateQuestionDto,
  ['questionnaireId', 'userType', 'dependsOnAnswerValue', 'dependsOnQuestionId', 'orderIndex'] as const
) {}
