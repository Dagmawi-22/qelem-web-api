import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'The username of the user.',
    example: 'john_doe123',
  })
  @IsString({ message: 'Username must be a string.' })
  @IsNotEmpty({ message: 'Username is required.' })
  @MinLength(3, { message: 'Username must be at least 3 characters long.' })
  username: string;

  @ApiProperty({
    description: 'The password of the user.',
    example: 'StrongPass123!',
  })
  @IsString({ message: 'Password must be a string.' })
  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  password: string;
}
