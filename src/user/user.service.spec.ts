import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { InternalServerErrorException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    const createDto = {
      username: 'testuser',
      hashedPassword: 'hashedpass123',
      fullName: 'Test User',
    };

    const mockUser = {
      id: 1,
      ...createDto,
      account: {
        id: 1,
        balance: 0.0,
        transactions: [],
      },
    };

    it('should create a user successfully', async () => {
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await service.create(
        createDto.username,
        createDto.hashedPassword,
        createDto.fullName,
      );

      expect(result).toEqual(mockUser);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          username: createDto.username,
          password: createDto.hashedPassword,
          fullName: createDto.fullName,
          account: {
            create: {
              balance: 0.0,
            },
          },
        },
        include: {
          account: {
            include: {
              transactions: true,
            },
          },
        },
      });
    });

    it('should throw InternalServerErrorException on create error', async () => {
      mockPrismaService.user.create.mockRejectedValue(new Error('DB error'));

      await expect(
        service.create(
          createDto.username,
          createDto.hashedPassword,
          createDto.fullName,
        ),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findOne', () => {
    const username = 'testuser';
    const mockUser = {
      id: 1,
      username,
      account: {
        transactions: [],
      },
    };

    it('should find a user by username successfully', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);

      const result = await service.findOne(username);

      expect(result).toEqual(mockUser);
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { username },
        include: {
          account: {
            include: {
              transactions: true,
            },
          },
        },
      });
    });

    it('should throw InternalServerErrorException on findOne error', async () => {
      mockPrismaService.user.findFirst.mockRejectedValue(new Error('DB error'));

      await expect(service.findOne(username)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findById', () => {
    const userId = 1;
    const mockUser = {
      id: userId,
      username: 'testuser',
    };

    it('should find a user by id successfully', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findById(userId);

      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should throw InternalServerErrorException on findById error', async () => {
      mockPrismaService.user.findUnique.mockRejectedValue(
        new Error('DB error'),
      );

      await expect(service.findById(userId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
