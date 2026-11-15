import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User, UserRole } from '@infrastructure/orm/entities/user.entity'
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'
import { Transform } from 'class-transformer';

export class AuthRegisterDTO {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'please enter a valid email address' })
  @Transform(({ value }) => value?.toLowerCase())
  email: string

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
    minLength: 8,
    maxLength: 20,
  })
  @IsNotEmpty()
  @IsString()
  @Length(8, 20, { message: 'password must be between 8 and 20 characters' })
  password: string

  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  first_name: string

  @ApiPropertyOptional({
    description: 'The last name of the user',
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  last_name: string

  @ApiPropertyOptional({
    description: 'The avatar URL of the user',
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsString()
  avatar: string

  @ApiProperty({
    description: 'The role of the user',
    enum: UserRole,
    example: UserRole.CONSUMER, // Replace with the actual value
  })
  @IsNotEmpty()
  @IsEnum(UserRole, {
    message: 'Type must be one of the following values: consumer '
  })
  type: UserRole

  @ApiProperty({
    description: 'Date of Birth of user',
    example: '1990-05-15',
    type: 'string',
    format: 'date',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  @IsDate()
  dob: Date;
}
export class AuthLoginDTO {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'please enter a valid email address' })
  email: string

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
    minLength: 8,
    maxLength: 20,
  })
  @IsNotEmpty()
  @IsString()
  @Length(8, 20, { message: 'password must be between 8 and 20 characters' })
  password: string
}

export class SocialSiteRegisterDTO {
  @ApiProperty({
    description: 'The access code for social site registration',
    example: 'someAccessCode123',
  })
  @IsNotEmpty()
  @IsString()
  accessCode

  @ApiProperty({
    description: 'The social site provider name',
    example: 'facebook',
  })
  @IsNotEmpty()
  @IsString()
  provider

}

export class AuthRefreshTokenDTO {
  @ApiProperty({
    description: 'The refresh token used to renew access',
    example: 'someRefreshToken123',
  })
  @IsString()
  @IsNotEmpty()
  refresh_token
}

export class UserPresenter {
  present(accessToken, refreshToken, isScanned, isSurveyDone, expiresIn): any {
    return {
      isScanned,
      isSurveyDone,
      accessToken,
      refreshToken,
      expiresIn,
    };
  }
}


export class VerifyEmailDto{
  @IsString()
  @IsNotEmpty()
  token: any;
}
