import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestOtpDto, VerifyOtpDto } from '../dto/otp.dto';
import { OTPType, User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OtpService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  /**
   * Generate and send OTP to a user
   */
  async requestOtp(requestOtpDto: RequestOtpDto) {
    const { email, phoneNumber, type } = requestOtpDto;

    // Verify that either email or phone is provided based on OTP type
    if (type === OTPType.EMAIL_VERIFICATION && !email) {
      throw new BadRequestException('Email is required for email verification');
    }

    if (type === OTPType.PHONE_VERIFICATION && !phoneNumber) {
      throw new BadRequestException(
        'Phone number is required for phone verification',
      );
    }

    // Find the user
    const user = await this.findUserByContactInfo(email, phoneNumber);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if there's an existing active OTP
    const existingOtp = await this.prisma.oTP.findFirst({
      where: {
        userId: user.id,
        type,
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    // If there's an existing OTP that hasn't expired yet and it was created less than 1 minute ago,
    // prevent generating a new one to avoid abuse
    if (
      existingOtp &&
      new Date().getTime() - existingOtp.createdAt.getTime() < 60000
    ) {
      throw new BadRequestException('Please wait before requesting a new OTP');
    }

    // Generate a 6-digit OTP
    const code = this.generateOtpCode();

    // Set expiration time (e.g., 10 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Save the OTP in database
    const otp = await this.prisma.oTP.create({
      data: {
        userId: user.id,
        type,
        code,
        expiresAt,
        isUsed: false,
      },
    });

    // Send the OTP - implemented separately in a notification service
    await this.sendOtp(user, code, type);

    return {
      message: 'OTP sent successfully',
      userId: user.id,
      expiresAt: otp.expiresAt,
      otp
    };
  }

  /**
   * Verify an OTP
   */
  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { userId, code } = verifyOtpDto;

    // Find the OTP in the database
    const otp = await this.prisma.oTP.findFirst({
      where: {
        userId,
        code,
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!otp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Mark the OTP as used
    await this.prisma.oTP.update({
      where: {
        id: otp.id,
      },
      data: {
        isUsed: true,
      },
    });

    // If it's an email or phone verification OTP, update the user's verifiedAt timestamp

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        verifiedAt: new Date(),
      },
    });
    return {
      message: 'OTP verified successfully',
      verified: true,
    };
  }

  /**
   * Generate a random 6-digit OTP code
   */
  private generateOtpCode(): string {
    const min = 100000; // 6 digits
    const max = 999999;
    return Math.floor(min + Math.random() * (max - min + 1)).toString();
  }

  /**
   * Send OTP to user via email or SMS
   * This is a placeholder for actual implementation
   */
  private async sendOtp(user: User, code: string, type: OTPType) {
    // Implementation details would depend on your notification service
    if (
      type === OTPType.EMAIL_VERIFICATION ||
      type === OTPType.PASSWORD_RESET
    ) {
      // Send email with OTP
      console.log(`Sending OTP ${code} to email ${user.email}`);
      // Implement email sending logic here or call your notification service
    } else if (type === OTPType.PHONE_VERIFICATION) {
      // Send SMS with OTP
      console.log(`Sending OTP ${code} to phone ${user.phoneNumber}`);
      // Implement SMS sending logic here or call your notification service
    }
  }

  /**
   * Find a user by email or phone number
   */
  private async findUserByContactInfo(email?: string, phoneNumber?: string) {
    if (!email && !phoneNumber) {
      return null;
    }

    const conditions = [];
    if (email) conditions.push({ email });
    if (phoneNumber) conditions.push({ phoneNumber });

    return this.prisma.user.findFirst({
      where: {
        OR: conditions,
      },
    });
  }
}
