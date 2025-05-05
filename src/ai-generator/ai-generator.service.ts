import { Injectable, NotFoundException } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as pdf from 'pdf-parse';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiGeneratorService {
  private genAI: GoogleGenerativeAI;
  private prisma = new PrismaService();

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  async extractTextFromPdf(buffer: Buffer): Promise<string> {
    try {
      const { default: pdf } = await import('pdf-parse');
      const data = await pdf(buffer);

      if (!data.text) {
        throw new Error('PDF contained no extractable text');
      }

      return data.text;
    } catch (error) {
      console.error('PDF Processing Error:', error);
      throw new Error(`Failed to process PDF: ${error.message}`);
    }
  }

  async generateExamQuestions(
    text: string,
    count: number,
    difficulty: string,
  ): Promise<any[]> {
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-pro-latest',
    });

    const prompt = `
    Generate ${count} ${difficulty}-difficulty multiple choice questions based on the following text.
    Each question should have 4 options with exactly one correct answer.
    Return as a JSON array where each item has:
    - question: string
    - options: array of { value: string (A-D), text: string, correct: boolean }

    Text:
    ${text}

    Return only valid JSON:`;

    const result = await model.generateContent(prompt);
    return this.parseJsonResponse(result.response.text());
  }

  async generateFlashcards(text: string, count: number): Promise<any[]> {
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-pro-latest',
    });

    const prompt = `
    Generate ${count} flashcard pairs (front/back) based on the following text.
    Front should be a question/term, back should be the answer/definition.
    Return as a JSON array where each item has:
    - front: string
    - back: string

    Text:
    ${text}

    Return only valid JSON:`;

    const result = await model.generateContent(prompt);
    return this.parseJsonResponse(result.response.text());
  }

  private parseJsonResponse(text: string): any[] {
    try {
      const jsonString = text.replace(/```json|```/g, '').trim();
      return JSON.parse(jsonString);
    } catch (e) {
      throw new Error('Failed to parse AI response');
    }
  }

  async getExamById(id: string) {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
      include: { questions: { include: { options: true } } },
    });
    if (!exam) throw new NotFoundException('Exam not found');
    return exam;
  }

  async getDeckById(id: string) {
    const deck = await this.prisma.deck.findUnique({
      where: { id },
      include: { flashcards: true },
    });
    if (!deck) throw new NotFoundException('Deck not found');
    return deck;
  }
}
