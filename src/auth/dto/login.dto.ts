import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'jd.doe@example.com',
    description:
      'The user identifier, which can be a phone number, email, or username',
  })
  @IsString({ message: 'Identifier must be a string' })
  @IsNotEmpty({ message: 'Identifier is required' })
  identifier: string;

  @ApiProperty({
    example: 'jd.doe@example.com',
    description: 'The user password',
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
