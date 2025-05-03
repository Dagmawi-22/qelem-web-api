import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';

export const RegisterSwagger = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Register new user' }),
    ApiBody({ type: CreateUserDto }),
    ApiResponse({
      status: 201,
      description: 'User successfully registered',
      schema: {
        example: {
          access_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG5fZG9lMTIzIiwic3ViIjo2LCJpYXQiOjE3MzQyMDA5NjF9.o1iRV3bh_2cGVfBBkhzGU2i7zIgGih2Q-gTQ7EiVfVk',
          user: {
            id: 6,
            username: 'john_doe123',
            fullName: 'John Doe',
            createdAt: '2024-12-14T18:29:21.696Z',
            updatedAt: '2024-12-14T18:29:21.696Z',
            deletedAt: null,
            account: {
              id: 3,
              balance: 0,
              userId: 6,
              createdAt: '2024-12-14T18:29:21.696Z',
              updatedAt: '2024-12-14T18:29:21.696Z',
              deletedAt: null,
              transactions: [],
            },
          },
        },
      },
    }),
    ApiResponse({ status: 400, description: 'Bad Request' }),
  );
};

export const LoginSwagger = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Login user' }),
    ApiBody({ type: LoginUserDto }),
    ApiResponse({
      status: 200,
      description: 'User successfully logged in',
      schema: {
        example: {
          access_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG5fZG9lMTIzIiwic3ViIjo2LCJpYXQiOjE3MzQyMDA5NjF9.o1iRV3bh_2cGVfBBkhzGU2i7zIgGih2Q-gTQ7EiVfVk',
          user: {
            id: 6,
            username: 'john_doe123',
            fullName: 'John Doe',
            createdAt: '2024-12-14T18:29:21.696Z',
            updatedAt: '2024-12-14T18:29:21.696Z',
            deletedAt: null,
            account: {
              id: 3,
              balance: 0,
              userId: 6,
              createdAt: '2024-12-14T18:29:21.696Z',
              updatedAt: '2024-12-14T18:29:21.696Z',
              deletedAt: null,
              transactions: [],
            },
          },
        },
      },
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
};
