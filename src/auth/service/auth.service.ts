import { LoginUserDto } from '../dto/login-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private generateToken(user: Pick<User, 'id' | 'username'>): string {
    const payload = { username: user.username, sub: user.id };
    const secret = this.configService.get<string>('JWT_SECRET')
    if (!secret) {
      throw new UnprocessableEntityException('JWT_SECRET is not configured');
    }
    return this.jwtService.sign(payload, { secret });
  }

  async register(createUserDto: CreateUserDto) {
    try {
      // const { username, password, fullName } = createUserDto;
      // const existingUser = await this.userService.findOne(username);
      // if (existingUser) {
      //   throw new ConflictException('Username is already taken');
      // }
      // const hashedPassword = await bcrypt.hash(password, 10);
      // // const user = await this.userService.create(
      //   username,
      //   hashedPassword,
      //   fullName,
      // );

      // const { password: _, ...userWithoutPassword } = user;

      // const access_token = this.generateToken(user);

      // return {
      //   access_token,
      //   user: userWithoutPassword,
      // };
      return true;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new UnauthorizedException('Registration failed', error.message);
    }
  }

  async validateUser(loginDto: LoginUserDto): Promise<Omit<User, 'password'>> {
    try {
      const { username, password } = loginDto;
      const user = await this.userService.findOne(username);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Authentication failed');
    }
  }

  async login(user: Omit<User, 'password'>) {
    try {
      const access_token = this.generateToken(user);

      const userWithDetails = await this.userService.findOne(user.username);

      const { password: _, ...userWithoutPassword } = userWithDetails;

      return {
        access_token,
        user: userWithoutPassword,
      };
    } catch (error) {
      throw new UnauthorizedException('Login failed', error.message);
    }
  }
}
