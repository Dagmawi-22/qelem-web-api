import { Module } from '@nestjs/common';
import { AiGeneratorController } from './ai-generator.controller';
import { AiGeneratorService } from './ai-generator.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AiGeneratorController],
  providers: [AiGeneratorService, PrismaService],
})
export class AiGeneratorModule {}
