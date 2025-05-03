import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { OtpService } from '../service/otp.service';
import { AuthService } from '../service/auth.service';
import { RequestOtpDto, VerifyOtpDto } from '../dto/otp.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { LoginSwagger, RegisterSwagger } from '../swagger/auth.swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly otpService: OtpService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @RegisterSwagger()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBody({ type: CreateUserDto })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @LoginSwagger()
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @ApiBody({ type: LoginUserDto })
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.authService.validateUser(loginUserDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('otp/request')
  @ApiOperation({ summary: 'Request an OTP' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBody({ type: RequestOtpDto })
  @HttpCode(HttpStatus.OK)
  async requestOtp(@Body() requestOtpDto: RequestOtpDto) {
    return this.otpService.requestOtp(requestOtpDto);
  }

  @Post('otp/verify')
  @ApiOperation({ summary: 'Verify an OTP' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid or expired OTP.' })
  @ApiBody({ type: VerifyOtpDto })
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.otpService.verifyOtp(verifyOtpDto);
  }
}
