import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOnboardingDto } from './dto/create-onboarding.dto';
import { UpdateOnboardingDto } from './dto/update-onboarding.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-questin.dto';
import { OnboardingQuestion } from '@prisma/client';
import { SubmitQuestionnaireDto } from './dto/answer-questions.dto';

@Injectable()
export class OnboardingService {
  constructor(private readonly prisma: PrismaService) {}

  /** 🎯 Create Questionnaire */
  async createQuestionnaire(createOnboardingDto: CreateOnboardingDto) {
    try {
      return await this.prisma.onboardingQuestionnaire.create({
        data: createOnboardingDto,
      });
    } catch (error) {
      throw new BadRequestException(
        'Failed to create questionnaire. Ensure all required fields are provided.',
      );
    }
  }

  /** 🎯 Create Questionnaire with Random Title and Bulk Questions (Simplified) */
async createBulkQuestions(questions: Omit<CreateQuestionDto, 'questionnaireId'>[]) {
  if (!questions || questions.length === 0) {
    throw new BadRequestException('At least one question is required.');
  }

  // Generate a random title for the questionnaire
  const randomTitle = `Questionnaire-${Math.floor(Math.random() * 10000)}`;
  const randomDescription = `Auto-generated on ${new Date().toISOString()}`;

  try {
    // 1. Create the questionnaire
    const questionnaire = await this.prisma.onboardingQuestionnaire.create({
      data: {
        title: randomTitle,
        userRole: "PATIENT",
        description: randomDescription,
      },
    });

    // 2. Prepare questions data with the new questionnaire ID
    const questionsWithQuestionnaireId = questions.map(question => ({
      ...question,
      questionnaireId: questionnaire.id,
      dependsOnQuestionId: undefined, // Explicitly ignore dependencies
    }));

    // 3. Create all questions
    const createdQuestions = await this.prisma.onboardingQuestion.createMany({
      data: questionsWithQuestionnaireId,
      skipDuplicates: true,
    });

    return {
      ...questionnaire,
      questionsCount: createdQuestions.count,
      questions: await this.prisma.onboardingQuestion.findMany({
        where: { questionnaireId: questionnaire.id },
      }),
    };
  } catch (error) {
    throw new BadRequestException(
      `Failed to create bulk questions: ${error.message}`,
    );
  }
}

  /** 🎯 Get All Questionnaires */
  async findAllQuestionnaires() {
    return await this.prisma.onboardingQuestionnaire.findMany({
      include: { questions: true },
    });
  }

/** 🎯 Get Latest Questionnaire */
async findLatestQuestionnaire() {
  const questionnaires = await this.prisma.onboardingQuestionnaire.findMany({
    include: { questions: true },
    orderBy: { createdAt: 'desc' }, 
    take: 1, 
  });

  return questionnaires[0] || null; 
}

  /** 🎯 Get Single Questionnaire */
  async findOneQuestionnaire(id: string) {
    const questionnaire = await this.prisma.onboardingQuestionnaire.findUnique({
      where: { id },
      include: { questions: true },
    });

    if (!questionnaire) {
      throw new NotFoundException(`Questionnaire with ID ${id} not found.`);
    }

    return questionnaire;
  }

  /** 🎯 Update Questionnaire */
  async updateQuestionnaire(
    id: string,
    updateOnboardingDto: UpdateOnboardingDto,
  ) {
    const existing = await this.prisma.onboardingQuestionnaire.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(
        `Cannot update: Questionnaire with ID ${id} not found.`,
      );
    }

    try {
      return await this.prisma.onboardingQuestionnaire.update({
        where: { id },
        data: updateOnboardingDto,
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to update questionnaire: ${error.message}`,
      );
    }
  }

  /** 🎯 Delete Questionnaire */
  async removeQuestionnaire(id: string) {
    const existing = await this.prisma.onboardingQuestionnaire.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(
        `Cannot delete: Questionnaire with ID ${id} not found.`,
      );
    }

    return await this.prisma.onboardingQuestionnaire.delete({ where: { id } });
  }

  /** 🎯 Create Question */
  async createQuestion(createQuestionDto: CreateQuestionDto) {
    const { questionnaireId, dependsOnQuestionId, ...rest } = createQuestionDto;

    // Validate Questionnaire existence
    const questionnaire = await this.prisma.onboardingQuestionnaire.findUnique({
      where: { id: questionnaireId },
    });

    if (!questionnaire) {
      throw new NotFoundException(
        `Cannot create question: Questionnaire with ID ${questionnaireId} does not exist.`,
      );
    }

    // Validate dependent question existence (if provided)
    if (dependsOnQuestionId) {
      const dependentQuestion = await this.prisma.onboardingQuestion.findUnique(
        { where: { id: dependsOnQuestionId } },
      );

      if (!dependentQuestion) {
        throw new NotFoundException(
          `Dependency error: Question with ID ${dependsOnQuestionId} does not exist.`,
        );
      }
    }

    try {
      return await this.prisma.onboardingQuestion.create({
        data: {
          ...rest,
          questionnaire: { connect: { id: questionnaireId } },
          dependsOnQuestion: dependsOnQuestionId
            ? { connect: { id: dependsOnQuestionId } }
            : undefined,
        },
      });
    } catch (error) {
      throw new BadRequestException(
        'Failed to create question. Please check the provided fields.',
      );
    }
  }

  /** 🎯 Get All Questions */
  async findAllQuestions() {
    return await this.prisma.onboardingQuestion.findMany({
      include: { questionnaire: true },
    });
  }

  /** 🎯 Get Single Question */
  async findOneQuestion(id: string) {
    const question = await this.prisma.onboardingQuestion.findUnique({
      where: { id },
      include: { questionnaire: true },
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found.`);
    }

    return question;
  }

  /** 🎯 Update Question */
  async updateQuestion(id: string, updateQuestionDto: UpdateQuestionDto) {
    const existingQuestion = await this.prisma.onboardingQuestion.findUnique({
      where: { id },
    });

    if (!existingQuestion) {
      throw new NotFoundException(
        `Cannot update: Question with ID ${id} not found.`,
      );
    }

    if (id) {
      const questionnaire =
        await this.prisma.onboardingQuestionnaire.findUnique({
          where: { id },
        });

      if (!questionnaire) {
        throw new NotFoundException(
          `Questionnaire with ID ${id} does not exist.`,
        );
      }
    }

    try {
      const { dependsOnQuestionId, ...data } = updateQuestionDto;
      return await this.prisma.onboardingQuestion.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to update question: ${error.message}`,
      );
    }
  }

  /** 🎯 Delete Question */
  async removeQuestion(id: string) {
    const existingQuestion = await this.prisma.onboardingQuestion.findUnique({
      where: { id },
    });

    if (!existingQuestion) {
      throw new NotFoundException(
        `Cannot delete: Question with ID ${id} not found.`,
      );
    }

    return await this.prisma.onboardingQuestion.delete({ where: { id } });
  }

  async submitQuestionnaire(submitDto: SubmitQuestionnaireDto) {
    const { questionnaireId, userId, answers } = submitDto;

    // Validate questionnaire exists
    const questionnaire = await this.prisma.onboardingQuestionnaire.findUnique({
      where: { id: questionnaireId },
      include: { questions: true },
    });

    if (!questionnaire) {
      throw new NotFoundException(`Questionnaire with ID ${questionnaireId} not found.`);
    }

    // Validate user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    // Get all questions for this questionnaire
    const questions = await this.prisma.onboardingQuestion.findMany({
      where: { questionnaireId },
      include: { dependsOnQuestion: true },
    });

    // Validate all answers
    for (const answer of answers) {
      const question = questions.find(q => q.id === answer.questionId);
      
      if (!question) {
        throw new BadRequestException(
          `Question with ID ${answer.questionId} not found in questionnaire ${questionnaireId}.`,
        );
      }

      // Check if required questions are answered
      if (question.isRequired && !answer.answer) {
        throw new BadRequestException(
          `Question ${question.id} is required but no answer was provided.`,
        );
      }

      // Check if answer meets any specific validation rules based on question type
      this.validateAnswer(question, answer.answer);
    }

    // Check for unanswered required questions
    const answeredQuestionIds = answers.map(a => a.questionId);
    const unansweredRequiredQuestions = questions.filter(
      q => q.isRequired && !answeredQuestionIds.includes(q.id),
    );

    if (unansweredRequiredQuestions.length > 0) {
      throw new BadRequestException(
        `Required questions not answered: ${unansweredRequiredQuestions.map(q => q.id).join(', ')}`,
      );
    }

    // Check conditional questions
    for (const question of questions) {
      if (question.dependsOnQuestionId) {
        const parentAnswer = answers.find(a => a.questionId === question.dependsOnQuestionId);
        
        if (parentAnswer && parentAnswer.answer === question.dependsOnAnswerValue) {
          // This question should be answered because the parent answer matches the condition
          if (!answers.some(a => a.questionId === question.id)) {
            throw new BadRequestException(
              `Conditional question ${question.id} should be answered based on parent answer.`,
            );
          }
        }
      }
    }

    // Delete existing answers for this questionnaire/user combination
    await this.prisma.onboardingAnswer.deleteMany({
      where: {
        userId,
        questionId: { in: questions.map(q => q.id) },
      },
    });

    // Create new answers
    const createdAnswers = await Promise.all(
      answers.map(answer =>
        this.prisma.onboardingAnswer.create({
          data: {
            userId,
            questionId: answer.questionId,
            answer: answer.answer,
          },
        }),
      ),
    );

    return {
      message: 'Questionnaire submitted successfully',
      answers: createdAnswers,
    };
  }

  /** 🎯 Get User's Questionnaire Answers */
  async getUserAnswers(userId: string, questionnaireId: string) {
    // Validate questionnaire exists
    const questionnaire = await this.prisma.onboardingQuestionnaire.findUnique({
      where: { id: questionnaireId },
    });

    if (!questionnaire) {
      throw new NotFoundException(`Questionnaire with ID ${questionnaireId} not found.`);
    }

    // Validate user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    // Get all questions for this questionnaire
    const questions = await this.prisma.onboardingQuestion.findMany({
      where: { questionnaireId },
    });

    // Get answers for these questions
    const answers = await this.prisma.onboardingAnswer.findMany({
      where: {
        userId,
        questionId: { in: questions.map(q => q.id) },
      },
      include: { question: true },
    });

    return {
      questionnaire,
      answers: answers.map(answer => ({
        questionId: answer.questionId,
        questionText: answer.question.question,
        answer: answer.answer,
        answeredAt: answer.createdAt,
      })),
    };
  }

  /** 🎯 Validate Answer Based on Question Type */
  async validateAnswer(question: OnboardingQuestion, answer: string) {
    switch (question.type) {
      case 'MULTIPLE_CHOICE':
        if (question.options) {
          const options = JSON.parse(JSON.stringify(question.options));
          if (!options.includes(answer)) {
            throw new BadRequestException(
              `Answer for question ${question.id} must be one of the provided options.`,
            );
          }
        }
        break;
      case 'RATING':
        if (isNaN(Number(answer))) {
          throw new BadRequestException(
            `Answer for question ${question.id} must be a number.`,
          );
        }
        break;
      case 'CHECKBOX':
        if (answer !== 'true' && answer !== 'false') {
          throw new BadRequestException(
            `Answer for question ${question.id} must be either 'true' or 'false'.`,
          );
        }
        break;
      // Add more validation cases as needed
      default:
        // For TEXT type, no specific validation needed
        break;
    }
  }

}
