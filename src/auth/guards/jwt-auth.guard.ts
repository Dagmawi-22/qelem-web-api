import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

interface JwtPayload {
  sub: number;
  username: string;
}

@Injectable()
export class JwtAuthGuard {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    const payload = await this.validateToken(token);
    const user = await this.validateUser(payload.username);
    await this.validateAccess(request, payload);

    request.user = user;
    return true;
  }

  private extractTokenFromHeader(request: any): string {
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header found');
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    return authHeader.substring(7);
  }

  private async validateToken(token: string): Promise<JwtPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      if (!payload.sub || !payload.username) {
        throw new UnauthorizedException('Invalid token payload structure');
      }

      return payload;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  private async validateUser(username: string) {
    const user = await this.userService.findOne(username);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  private async validateAccess(
    request: any,
    payload: JwtPayload,
  ): Promise<void> {
    const requestedUserId = +request.params.id;
    if (requestedUserId && payload.sub !== requestedUserId) {
      throw new ForbiddenException('Access denied');
    }
  }
}
