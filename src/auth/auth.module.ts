import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './service/auth.service';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt/jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { AuthController, UserController } from './controller/user.controller';
import { OtpService } from './service/otp.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'fallbackSecret123'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    PrismaService,
    UserService,
    OtpService,
  ],
  controllers: [UserController, AuthController],
})
export class AuthModule {}
