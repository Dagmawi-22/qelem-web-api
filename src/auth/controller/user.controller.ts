import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  ParseUUIDPipe,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import { OtpService } from '../service/otp.service';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { CreatePhysicianDto } from '../dto/create-physician.dto';
import { RequestOtpDto, VerifyOtpDto } from '../dto/otp.dto';
import { LoginDto } from '../dto/login.dto';
import { UpdatePhysicianDto } from '../dto/update-physician.dto';
import { PatientCreationInterceptor } from '../../interceptors/patient-created.interceptor';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'Login succeeded',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBody({ type: LoginDto })
  async loginUser(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto.identifier, loginDto.password);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({
    status: 200,
    description: 'Register succeeded',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBody({ type: CreateUserDto })
  async registerUser(@Body() registerDto: CreateUserDto) {
    return this.userService.register(registerDto);
  }

  @Post('patient')
  @UseInterceptors(PatientCreationInterceptor)
  @ApiOperation({ summary: 'Create a new patient' })
  @ApiResponse({
    status: 201,
    description: 'The patient has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 409, description: 'User already exists.' })
  @ApiBody({ type: CreatePatientDto })
  async createPatient(@Body() createPatientDto: CreatePatientDto) {
    return this.userService.createPatient(createPatientDto);
  }

  @Post('physician')
  @ApiOperation({ summary: 'Create a new physician' })
  @ApiResponse({
    status: 201,
    description: 'The physician has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 409, description: 'User already exists.' })
  @ApiBody({ type: CreatePhysicianDto })
  async createPhysician(@Body() createPhysicianDto: CreatePhysicianDto) {
    return this.userService.createPhysician(createPhysicianDto);
  }

  @Patch('physician/:id')
  @ApiOperation({ summary: 'Update an existing physician' })
  @ApiResponse({
    status: 200,
    description: 'The physician has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Physician not found.' })
  @ApiBody({ type: UpdatePhysicianDto })
  async updatePhysician(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePhysicianDto: UpdatePhysicianDto,
  ) {
    return this.userService.updatePhysician(id, updatePhysicianDto);
  }

  @Patch('patient/:id')
  @ApiOperation({ summary: 'Update an existing patient' })
  @ApiResponse({
    status: 200,
    description: 'The patient has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Patient not found.' })
  @ApiBody({ type: UpdatePatientDto })
  async updatePatient(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    return this.userService.updatePatient(id, updatePatientDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(@Param('id', ParseIntPipe) id: string) {
    return this.userService.findUserById(id);
  }
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly otpService: OtpService) {}

  @Post('otp/request')
  @ApiOperation({ summary: 'Request an OTP' })
  @ApiResponse({
    status: 200,
    description: 'The OTP has been successfully sent.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBody({ type: RequestOtpDto })
  @HttpCode(HttpStatus.OK)
  async requestOtp(@Body() requestOtpDto: RequestOtpDto) {
    return this.otpService.requestOtp(requestOtpDto);
  }

  @Post('otp/verify')
  @ApiOperation({ summary: 'Verify an OTP' })
  @ApiResponse({
    status: 200,
    description: 'The OTP has been successfully verified.',
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired OTP.' })
  @ApiBody({ type: VerifyOtpDto })
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.otpService.verifyOtp(verifyOtpDto);
  }
}
