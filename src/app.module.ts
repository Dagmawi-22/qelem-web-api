import { Module } from '@nestjs/common';
import { AiGeneratorModule } from './ai-generator/ai-generator.module';

@Module({
  imports: [AiGeneratorModule],
  providers: [],
})
export class AppModule {}
