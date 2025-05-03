import { Module } from '@nestjs/common';
import { AiGeneratorController } from './ai-generator.controller';
import { AiGeneratorService } from './ai-generator.service';

@Module({
  controllers: [AiGeneratorController],
  providers: [AiGeneratorService],
})
export class AiGeneratorModule {}