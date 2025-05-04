# qelem api 🚀

![NestJS](https://img.shields.io/badge/NestJS-ea2845?style=flat&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![MIT License](https://img.shields.io/badge/license-MIT-blue)

A robust NestJS API that converts static PDFs into:
- Interactive quizzes ✏️
- Customizable exams 📝
- Anki-compatible flashcard decks 🗂️
- Structured study guides 📚

**Frontend Companion**: [pdf-learning-ui](https://github.com/Dagmawi-22/qelem) (SvelteKit + TailwindCSS)

## Table of Contents
- [Features](#-features)
- [Installation](#-installation)
- [API Documentation](#-api-documentation)
- [Development](#-development)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Features

### PDF Processing
```typescript
interface PDFProcessingFeatures {
  textExtraction: 'accurate' | 'fast';
  structureAnalysis: boolean;
  imageHandling: 'extract' | 'ignore';
}
