import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'please enter a valid email address' })
  email: string;
}

export class UserDetailsDtoMobile {
  @ApiProperty({ description: 'The first name of the user', example: 'Ken' })
  @IsOptional()
  @IsString()
  first_name?: string;

  @ApiProperty({ description: 'The last name of the user', example: 'Kanji' })
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '+92 4354284',
  })
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiProperty({
    description: 'The address of the user',
    example: '10880 Malibu Point, 90265',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Photo url',
    example: 'https://atlus.com/wp-content/uploads/2020/06/Avatar-Kanji.jpg',
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    description: 'Date of Birth of user',
    example: '1990-05-15',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsDate()
  dob?: Date;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'The reset token provided for resetting the password.',
    example: '12345-abcde-token',
  })
  @IsString({ message: 'Token must be a string' })
  @MinLength(10, { message: 'Token must be at least 10 characters long' })
  token: string;

  @ApiProperty({
    description: 'The new password for the user.',
    example: 'UBU@1234',
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(20, { message: 'Password cannot be longer than 20 characters' })
  newPassword: string;
}

export class ChangePasswordDto {
  @ApiProperty({
    description: 'The new password for the user.',
    example: 'UBU@1234',
  })
  @IsString({ message: 'Old Password must be a string' })
  @MinLength(8, { message: 'Old Password must be at least 8 characters long' })
  @MaxLength(20, {
    message: 'Old Password cannot be longer than 20 characters',
  })
  oldPassword: string;

  @ApiProperty({
    description: 'The new password for the user.',
    example: 'UBU@1234',
  })
  @IsString({ message: 'New Password must be a string' })
  @MinLength(8, { message: 'New Password must be at least 8 characters long' })
  @MaxLength(20, {
    message: 'New Password cannot be longer than 20 characters',
  })
  newPassword: string;
}

export class updateUserDto {
  @ApiProperty({
    description: 'First Name of user',
    example: 'Elizabeth',
  })
  @IsNotEmpty()
  @IsString({ message: 'first name must be a string' })
  first_name: string;

  @ApiProperty({
    description: 'Last Name of user',
    example: 'Olsen',
  })
  @IsNotEmpty()
  @IsString({ message: 'last name must be a string' })
  last_name: string;

  @ApiProperty({
    description: 'Date of Birth of user',
    example: '1990-05-15',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsDate()
  dob?: Date;

  @IsOptional()
  @IsString({ message: 'Brand name must be a string' })
  brand_name: string;
}

export class deleteResponseDto {
  statusCode: number;
  message: string;
}
