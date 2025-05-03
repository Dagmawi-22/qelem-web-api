import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AiGeneratorService } from './ai-generator.service';
import { memoryStorage } from 'multer';
import { GenerateContentDto } from './dto/generate-content.dto';

@Controller('generate')
export class AiGeneratorController {
  constructor(private readonly aiService: AiGeneratorService) {}

  @Post()
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
  async generateContent(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: GenerateContentDto,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const text = await this.aiService.extractTextFromPdf(file.buffer);

    if (body.type === 'exam') {
      return this.aiService.generateExamQuestions(
        text,
        body.count || 10,
        body.difficulty || 'medium',
      );
    }
    return this.aiService.generateFlashcards(text, body.count || 10);
  }
}
