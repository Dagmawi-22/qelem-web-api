import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { CreatePatientDto } from '../auth/dto/create-patient.dto';
import { CreatePhysicianDto } from '../auth/dto/create-physician.dto';
import { OTPType, User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { sendSms } from '../helpers/send.afro.sms';
import { UpdatePhysicianDto } from 'src/auth/dto/update-physician.dto';
import { UpdatePatientDto } from 'src/auth/dto/update-patient.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(identifier: string, password: string) {
    const userData = await this.validateUser(identifier, password);
    const { password: _, ...user } = userData;
  
    const payload = { sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
  
    return { 
      message: 'Login successful', 
      user,
     token,
     refreshToken
    };
  }

  async register(userDto: CreateUserDto) {
    if (!userDto.email && !userDto.phoneNumber) {
      throw new BadRequestException('Email or phone number is required');
    }

    await this.checkUserExists(userDto);

    const hashedPassword = userDto.password
      ? await bcrypt.hash(userDto.password, 10)
      : null;

    const userData = await this.prisma.user.create({
      data: {
        username: userDto?.username,
        email: userDto?.email,
        phoneNumber: userDto.phoneNumber,
        password: hashedPassword,
        isAnonymous: userDto?.isAnonymous || false,
        role: userDto?.role || UserRole.PATIENT,
      },
      include: {
        patient: true,
        physician: true,
      },

    });

    const { password: _, ...user } = userData;

    // Generate tokens
    const payload = { sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Send OTP for verification
    const otp = await this.sendOTP(user.id, OTPType.PHONE_VERIFICATION);

    return {
      message: 'User registered successfully',
      user,
      tokens: {
        accessToken,
        refreshToken,
      },
      otp,
    };
  }

  async validateUser(identifier: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { phoneNumber: identifier },
          { email: identifier },
          { username: identifier },
        ],
      },
      include: {
        patient: true,
        physician: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.verifiedAt) {
      throw new ForbiddenException('User is not verified');
    }

    const isPasswordValid = user.password
      ? await bcrypt.compare(password, user.password)
      : false;
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  /**
   * Generate a 4-digit OTP
   */
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async sendOTP(userId: string, type: OTPType) {
    const otpCode = this.generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.prisma.oTP.create({
      data: {
        userId,
        type,
        code: otpCode,
        expiresAt,
      },
    });

    await sendSms('+251918888225', `${otpCode}`);
    return otpCode;
  }

  /**
   * Create a new user and send OTP
   */
  async createUser(createUserDto: CreateUserDto) {
    if (!createUserDto.email && !createUserDto.phoneNumber) {
      throw new BadRequestException('Email or phone number is required');
    }

    await this.checkUserExists(createUserDto);

    const hashedPassword = createUserDto.password
      ? await bcrypt.hash(createUserDto.password, 10)
      : null;

    const user = await this.prisma.user.create({
      data: {
        username: createUserDto?.username,
        email: createUserDto?.email,
        phoneNumber: createUserDto.phoneNumber,
        password: hashedPassword,
        isAnonymous: createUserDto?.isAnonymous || false,
        role: createUserDto?.role || UserRole.PATIENT,
      },
    });

    const otp = await this.sendOTP(String(user.id), OTPType.PHONE_VERIFICATION);
    return { message: 'User created. OTP sent for verification.', user, otp };
  }

  /**
   * Create a new patient with user account
   */
  async createPatient(createPatientDto: CreatePatientDto) {
    const { userId, ...rest } = createPatientDto;

    const user = await this.prisma.user.findFirst({
      where: { id: userId },   
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Then create patient profile
    const patient = await this.prisma.patient.create({
      data: {
        ...rest,
        user: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            phoneNumber: true,
            role: true,
            createdAt: true,
            lang: true,
          },
        },
      },
    });

    return patient;
  }

  /**
   * Create a new physician with user account
   */
  async createPhysician(createPhysicianDto: CreatePhysicianDto) {
    const user = await this.prisma.user.findFirst({
      where: { id: createPhysicianDto.userId },   
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${createPhysicianDto.userId} not found`);
    }
    let categoriesToConnect = [];

    if (
      createPhysicianDto?.categoryIds &&
      createPhysicianDto?.categoryIds.length > 0
    ) {
      categoriesToConnect = await this.prisma.physicianCategory.findMany({
        where: {
          id: { in: createPhysicianDto.categoryIds },
        },
      });

      categoriesToConnect = categoriesToConnect.map((category) => ({
        id: category.id,
      }));
    }

    const physician = await this.prisma.physician.create({
      data: {
        specialization: createPhysicianDto?.specialization,
        qualifications: createPhysicianDto?.qualifications,
        experience: createPhysicianDto?.experience,
        biography: createPhysicianDto?.biography,
        licenseNumber: createPhysicianDto?.licenseNumber,
        firstName: createPhysicianDto?.firstName,
        lastName: createPhysicianDto?.lastName,
        categories: {
          connect: categoriesToConnect,
        },
        user: {
          connect: {
            id: createPhysicianDto?.userId,
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            phoneNumber: true,
            role: true,
            createdAt: true,
          },
        },
        categories: true,
      },
    });

    return physician;
  }

  /**
   * Update an existing physician and user (if user data is provided)
   */
  async updatePhysician(id: string, updatePhysicianDto: UpdatePhysicianDto) {
    const physician = await this.prisma.physician.findUnique({
      where: { id },
    });
    if (!physician)
      throw new NotFoundException(`Physician with user ID ${id} not found`);

    if (Object.keys(updatePhysicianDto).length) {
      await this.prisma.user.update({
        where: { id },
        data: updatePhysicianDto,
      });
    }

    const categoriesToConnect = updatePhysicianDto?.categoryIds?.length
      ? await this.prisma.physicianCategory.findMany({
          where: {
            id: { in: updatePhysicianDto.categoryIds },
          },
        })
      : [];

    return this.prisma.physician.update({
      where: { userId: id },
      data: {
        ...updatePhysicianDto,
        categories: {
          set: categoriesToConnect.map((category) => ({ id: category.id })),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            phoneNumber: true,
            role: true,
            createdAt: true,
          },
        },
        categories: true,
      },
    });
  }

  async updatePatient(id: string, updatePatientDto: UpdatePatientDto) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
    });
    if (!patient)
      throw new NotFoundException(`Patient with user ID ${id} not found`);

    const { userId, ...rest } = updatePatientDto;
    return this.prisma.patient.update({
      where: { id },
      data: {
        ...rest,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            phoneNumber: true,
            role: true,
            createdAt: true,
          },
        },
      },
    });
  }

  /**
   * Check if a user with the given username, email or phone already exists
   */
  private async checkUserExists(userData: {
    username?: string;
    email?: string;
    phoneNumber?: string;
  }) {
    const { username, email, phoneNumber } = userData;

    // Build conditions for query
    const conditions = [];
    if (username) conditions.push({ username });
    if (email) conditions.push({ email });
    if (phoneNumber) conditions.push({ phoneNumber });

    if (conditions.length === 0) return;

    // Find any user with matching credentials
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: conditions,
      },
      select: {
        username: true,
        email: true,
        phoneNumber: true,
      },
    });

    if (!existingUser) return;

    // Determine which field caused the conflict
    if (username && existingUser.username === username) {
      throw new ConflictException(`Username '${username}' is already taken`);
    }
    if (email && existingUser.email === email) {
      throw new ConflictException(`Email '${email}' is already registered`);
    }
    if (phoneNumber && existingUser.phoneNumber === phoneNumber) {
      throw new ConflictException(
        `Phone number '${phoneNumber}' is already registered`,
      );
    }
  }

  /**
   * Find a user by ID
   */

  async findOne(phoneNumber: string) {
    const user = await this.prisma.user.findUnique({
      where: { phoneNumber },
      include: {
        patient: true,
        physician: true,
      },
    });

    return user;
  }
  async findUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        patient: true,
        physician: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async verifyOTP(phoneNumber: string, code: string) {
    const user = await this.prisma.user.findUnique({
      where: { phoneNumber },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otp = await this.prisma.oTP.findFirst({
      where: {
        userId: user.id,
        code,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!otp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    await this.prisma.oTP.update({
      where: { id: otp.id },
      data: { isUsed: true },
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { verifiedAt: new Date() },
    });

    return { message: 'User verified successfully' };
  }
}
