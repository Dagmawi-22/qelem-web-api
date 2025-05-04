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
##### 
- The user uploads a PDF document containing learning material.

- Input Parameters
    The user specifies:

- Maximum number of questions desired

- Difficulty level (easy, medium, or hard)

- Content type: flashcards or exam

- Content Extraction
 The system extracts raw text from the PDF.

- Content Generation via Gemini API
The extracted content is sent to the Gemini API to generate either:

A deck of flashcards, or

A structured set of exam questions

Output Formatting & Saving
The generated content is formatted in a predefined structure and saved as a JSON file.

Download/Return Result
The final output file is returned to the user for access.
