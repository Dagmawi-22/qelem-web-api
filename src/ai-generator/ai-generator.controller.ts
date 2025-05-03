import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Body,
  Param,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AiGeneratorService } from './ai-generator.service';
import { PrismaService } from '../prisma/prisma.service';
import { GenerateContentDto } from './dto/generate-content.dto';

@Controller('content')
export class AiGeneratorController {
  constructor(
    private readonly contentService: AiGeneratorService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('generate-from-pdf')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only PDF files are allowed'), false);
        }
      },
    }),
  )
  async generateFromPdf(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: GenerateContentDto,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');

    const text = await this.contentService.extractTextFromPdf(file.buffer);

    return body.type === 'exam'
      ? this.contentService.generateExamQuestions(
          text,
          body.count || 10,
          body.difficulty || 'medium',
        )
      : this.contentService.generateFlashcards(text, body.count || 10);
  }

  @Get('exams/:id')
  async getExam(@Param('id') id: string) {
    return this.contentService.getExamById(id);
  }

  @Get('decks/:id')
  async getDeck(@Param('id') id: string) {
    return this.contentService.getDeckById(id);
  }
}
