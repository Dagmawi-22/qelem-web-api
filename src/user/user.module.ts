import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';

@Module({
  imports: [JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '1h' },
    }),
  }),
  ConfigModule
],
  providers: [UserService, PrismaService, JwtStrategy],
  exports: [JwtModule],
  controllers: [],
})
export class UserModule {}
