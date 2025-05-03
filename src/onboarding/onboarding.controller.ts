import { 
  Controller, Get, Post, Body, Patch, Param, Delete 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { OnboardingService } from './onboarding.service';
import { CreateOnboardingDto } from './dto/create-onboarding.dto';
import { UpdateOnboardingDto } from './dto/update-onboarding.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-questin.dto';
import { SubmitQuestionnaireDto } from './dto/answer-questions.dto';
import { CreateQuestionWithoutQuestionnaireDto } from './dto/bulk-question.dto';

@ApiTags('onboarding') 
@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  /** 📌 Create Questionnaire */
  @ApiOperation({ summary: 'Create a new questionnaire' })
  @ApiBody({ type: CreateOnboardingDto })
  @ApiResponse({ status: 201, description: 'Questionnaire created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @Post('questionnaire')
  createQuestionnaire(@Body() createOnboardingDto: CreateOnboardingDto) {
    return this.onboardingService.createQuestionnaire(createOnboardingDto);
  }

    /** 📌 Create Questionnaire */
    @ApiOperation({ summary: 'Create bulk questionnaire questions' })
    @ApiBody({ 
      type: [CreateQuestionWithoutQuestionnaireDto], 
      description: 'Array of questions to create' 
    })
    @ApiResponse({ status: 201, description: 'Questionnaire created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    @Post('questionnaire/bulk')
    createBulkQuestionnaire(@Body() createQuestionsDto: CreateQuestionDto[]) {
      return this.onboardingService.createBulkQuestions(createQuestionsDto);
    }

  /** 📌 Get All Questionnaires */
  @ApiOperation({ summary: 'Get all questionnaires' })
  @ApiResponse({ status: 200, description: 'List of questionnaires' })
  @Get('questionnaire')
  findAllQuestionnaires() {
    return this.onboardingService.findAllQuestionnaires();
  }

    /** 📌 Get Latest Questionnaire */
    @ApiOperation({ summary: 'Get latest questionnaire' })
    @ApiResponse({ status: 200, description: 'List of questionnaires' })
    @Get('questionnaire/latest')
    findLatestQuestionnaire() {
      return this.onboardingService.findLatestQuestionnaire();
    }

  /** 📌 Get a Single Questionnaire */
  @ApiOperation({ summary: 'Get a single questionnaire' })
  @ApiParam({ name: 'id', type: Number, description: 'Questionnaire ID' })
  @ApiResponse({ status: 200, description: 'Questionnaire found' })
  @ApiResponse({ status: 404, description: 'Questionnaire not found' })
  @Get('questionnaire/:id')
  findOneQuestionnaire(@Param('id') id: string) {
    return this.onboardingService.findOneQuestionnaire(id);
  }

  /** 📌 Update Questionnaire */
  @ApiOperation({ summary: 'Update a questionnaire' })
  @ApiParam({ name: 'id', type: Number, description: 'Questionnaire ID' })
  @ApiBody({ type: UpdateOnboardingDto })
  @ApiResponse({ status: 200, description: 'Questionnaire updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Questionnaire not found' })
  @Patch('questionnaire/:id')
  updateQuestionnaire(@Param('id') id: string, @Body() updateOnboardingDto: UpdateOnboardingDto) {
    return this.onboardingService.updateQuestionnaire(id, updateOnboardingDto);
  }

  /** 📌 Delete Questionnaire */
  @ApiOperation({ summary: 'Delete a questionnaire' })
  @ApiParam({ name: 'id', type: Number, description: 'Questionnaire ID' })
  @ApiResponse({ status: 200, description: 'Questionnaire deleted successfully' })
  @ApiResponse({ status: 404, description: 'Questionnaire not found' })
  @Delete('questionnaire/:id')
  removeQuestionnaire(@Param('id') id: string) {
    return this.onboardingService.removeQuestionnaire(id);
  }

  /** 📌 Create Question */
  @ApiOperation({ summary: 'Create a new question' })
  @ApiBody({ type: CreateQuestionDto })
  @ApiResponse({ status: 201, description: 'Question created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @Post('question')
  createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    return this.onboardingService.createQuestion(createQuestionDto);
  }

  /** 📌 Get All Questions */
  @ApiOperation({ summary: 'Get all questions' })
  @ApiResponse({ status: 200, description: 'List of questions' })
  @Get('question')
  findAllQuestions() {
    return this.onboardingService.findAllQuestions();
  }

  /** 📌 Get a Single Question */
  @ApiOperation({ summary: 'Get a single question' })
  @ApiParam({ name: 'id', type: Number, description: 'Question ID' })
  @ApiResponse({ status: 200, description: 'Question found' })
  @ApiResponse({ status: 404, description: 'Question not found' })
  @Get('question/:id')
  findOneQuestion(@Param('id') id: string) {
    return this.onboardingService.findOneQuestion(id);
  }

  /** 📌 Update Question */
  @ApiOperation({ summary: 'Update a question' })
  @ApiParam({ name: 'id', type: Number, description: 'Question ID' })
  @ApiBody({ type: UpdateQuestionDto })
  @ApiResponse({ status: 200, description: 'Question updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Question not found' })
  @Patch('question/:id')
  updateQuestion(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.onboardingService.updateQuestion(id, updateQuestionDto);
  }

  /** 📌 Delete Question */
  @ApiOperation({ summary: 'Delete a question' })
  @ApiParam({ name: 'id', type: Number, description: 'Question ID' })
  @ApiResponse({ status: 200, description: 'Question deleted successfully' })
  @ApiResponse({ status: 404, description: 'Question not found' })
  @Delete('question/:id')
  removeQuestion(@Param('id') id: string) {
    return this.onboardingService.removeQuestion(id);
  }

  @ApiOperation({ summary: 'Submit answers for a questionnaire' })
  @ApiBody({ type: SubmitQuestionnaireDto })
  @ApiResponse({ status: 201, description: 'Answers submitted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input or validation failed' })
  @ApiResponse({ status: 404, description: 'Questionnaire or question not found' })
  @Post('submit')
  async submitQuestionnaire(@Body() submitDto: SubmitQuestionnaireDto) {
    return this.onboardingService.submitQuestionnaire(submitDto);
  }

  @ApiOperation({ summary: "Get a user's questionnaire answers" })
  @ApiParam({ name: 'userId', type: String, description: 'User ID' })
  @ApiParam({ name: 'questionnaireId', type: String, description: 'Questionnaire ID' })
  @ApiResponse({ status: 200, description: 'Answers retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Answers not found' })
  @Get('answers/:userId/:questionnaireId')
  async getUserAnswers(
    @Param('userId') userId: string,
    @Param('questionnaireId') questionnaireId: string,
  ) {
    return this.onboardingService.getUserAnswers(userId, questionnaireId);
  }
}
