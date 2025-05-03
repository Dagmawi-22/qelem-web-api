import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockUser = {
    id: 1,
    username: 'testuser',
    password: 'hashedpassword',
    fullName: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  };

  const mockUserService = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const createUserDto = {
        username: 'newuser',
        password: 'password123',
        fullName: 'New User',
      };

      mockUserService.findOne.mockResolvedValue(null);
      mockUserService.create.mockResolvedValue(mockUser);
      mockConfigService.get.mockReturnValue('jwt_secret');
      mockJwtService.sign.mockReturnValue('mock_token');

      const result = await authService.register(createUserDto);

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
      expect(result.user).not.toHaveProperty('password');
    });

    it('should throw ConflictException if username already exists', async () => {
      const createUserDto = {
        username: 'existinguser',
        password: 'password123',
        fullName: 'Existing User',
      };

      mockUserService.findOne.mockResolvedValue(mockUser);

      await expect(authService.register(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('validateUser', () => {
    it('should successfully validate user credentials', async () => {
      const loginDto = {
        username: 'testuser',
        password: 'correctpassword',
      };

      mockUserService.findOne.mockResolvedValue(mockUser);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));

      const result = await authService.validateUser(loginDto);

      expect(result).not.toHaveProperty('password');
      expect(result.username).toBe(mockUser.username);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto = {
        username: 'testuser',
        password: 'wrongpassword',
      };

      mockUserService.findOne.mockResolvedValue(mockUser);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      await expect(authService.validateUser(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('login', () => {
    it('should successfully login user and return token', async () => {
        const userWithoutPassword: Omit<User, 'password'> = {
          id: mockUser.id,
          username: mockUser.username,
          fullName: mockUser.fullName,
          createdAt: mockUser.createdAt,
          updatedAt: mockUser.updatedAt,
          deletedAt:  mockUser.deletedAt
        };

      mockUserService.findOne.mockResolvedValue(mockUser);
      mockConfigService.get.mockReturnValue('jwt_secret');
      mockJwtService.sign.mockReturnValue('mock_token');

      const result = await authService.login(userWithoutPassword);

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
      expect(result.user).not.toHaveProperty('password');
    });
  });
});
