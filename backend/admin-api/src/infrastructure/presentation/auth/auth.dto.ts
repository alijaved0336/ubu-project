import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsObject, IsOptional, IsString, Length } from 'class-validator';
import { InfluencerAdditionalDto, InfluencerDTO } from '../influencer/influencer.dto';
import { Transform, Type } from 'class-transformer';
import { AdditionalFieldsDTO, BrandDto } from '../brand/brand.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthRegisterDTO {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'please enter a valid email address' })
  email: string;

  @ApiProperty({
    description: 'The avatar file of the user',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  avatar: any;

  @ApiProperty({
    type: Boolean, // Corrected here
    description: 'Indicates if the entity is a brand', // Optional: Add a description for better API docs
  })
  @IsBoolean()
  @IsOptional()
  is_brand?: boolean;

  @ApiProperty({
    type: Boolean, // Corrected here
    description: 'Indicates if the entity is a Influncer', // Optional: Add a description for better API docs
  })
  @IsBoolean()
  @IsOptional()
  is_influencer?: boolean;

  @ApiProperty({
    type: Boolean, // Corrected here
    description: 'Indicates if the entity is a Consumer', // Optional: Add a description for better API docs
  })
  @IsBoolean()
  @IsOptional()
  is_consumer?: boolean;

  // @ApiProperty({
  //   description: 'The role of the user',
  //   example: UserRole.INFLUENCER,
  //   enum: [
  //     UserRole.INFLUENCER,
  //     UserRole.BRAND,
  //     UserRole.CONSUMER,
  //     UserRole.SUPERADMIN,
  //   ],
  // })
  // @IsNotEmpty()
  // type: UserRole;

  @ApiPropertyOptional({
    description: 'The phone number of the user',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  phone_number: string;

  @ApiPropertyOptional({
    description: 'Influencer-specific data',
    type: () => InfluencerDTO,
  })
  @IsOptional()
  @Type(() => InfluencerDTO)
  influencer: InfluencerDTO;

  @ApiPropertyOptional({
    description: 'Brand-specific data',
    type: () => BrandDto,
  })
  @IsOptional()
  @Type(() => BrandDto)
  brand: BrandDto;

  @ApiPropertyOptional({
    description: 'Additional fields data',
    type: () => AdditionalFieldsDTO,
  })
  @IsOptional()
  @Type(() => AdditionalFieldsDTO)
  additionalFields: AdditionalFieldsDTO;

  @ApiPropertyOptional({
    description: 'Address of the user',
    example: '123 Main St',
  })
  @IsOptional()
  @IsString()
  address: string;

  @ApiPropertyOptional({
    description: 'City of the user',
    example: 'New York',
  })
  @IsOptional()
  @IsString()
  city: string;

  @ApiPropertyOptional({
    description: 'State of the user',
    example: 'NY',
  })
  @IsOptional()
  @IsString()
  state: string;

  @ApiPropertyOptional({
    description: 'Zip code of the user',
    example: '10001',
  })
  @IsOptional()
  @IsString()
  @Length(5, 10)
  zip_code: string;

  @ApiPropertyOptional({
    description: 'Additional influencer-specific data',
    type: () => InfluencerAdditionalDto,
  })
  @IsOptional()
  @Type(() => InfluencerAdditionalDto)
  influencerAdditionalDto: InfluencerAdditionalDto;

  @IsOptional()
  instagram_creds;
}

export class RefreshToken {
  @ApiProperty({
    description: 'Refresh Token',
    example: 'ehjbknkzndflksdmflksd',
  })
  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}

export class AuthAdditionalDataDTO {
  @ApiProperty({
    description: 'IP address of the user',
    example: '192.168.1.1',
  })
  @IsNotEmpty()
  @IsString()
  ip_address: string;

  @ApiProperty({
    description: 'Operating system information of the user',
    example: 'Windows 10',
  })
  @IsNotEmpty()
  @IsString()
  operating_system: string;

  @ApiProperty({
    description: 'Browser information of the user',
    example: 'Chrome 89',
  })
  @IsNotEmpty()
  @IsString()
  browsing_info: string;

  @ApiProperty({
    description: 'Device type of the user',
    example: 'mobile',
  })
  @IsNotEmpty()
  @IsString()
  device_type: string;
}
export class AuthLoginDTO {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'please enter a valid email address' })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  @Length(8, 20, { message: 'password must be between 8 and 20 characters' })
  password: string;

  @ApiProperty({
    description: 'Additional data for the login request',
    type: AuthAdditionalDataDTO,
    required: false,
  })
  @IsObject()
  @IsOptional()
  sessionLog?: AuthAdditionalDataDTO;
}

export class AuthSignUpDTO {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'please enter a valid email address' })
  @Transform(({ value }) => value?.toLowerCase())
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  @Length(8, 20, { message: 'password must be between 8 and 20 characters' })
  password: string;
  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  first_name: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  last_name: string;

  @ApiProperty({
    description: 'ReCaptacha Token',
    example: 'tokenxyz',
  })

  @ApiProperty({
    description: 'Date of Birth of user',
    example: '1990-05-15',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  @IsDate()
  dob?: Date;

  @IsOptional()
  @IsString()
  recaptchaToken: string;

  @IsOptional()
  apple_identifier?: string;

  @IsOptional()
  avatar?: string;

  @IsOptional()
  isTestMode?: boolean;
}

export class CheckEmailDTO {
  @ApiProperty({
    description: 'The email to check',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsString()
  // @IsEmail()
  email: string;
}

export class GoogleTokenDto {
  @IsNotEmpty()
  @IsString()
  access_token: string;

  @ApiProperty({
    description: 'Additional data for the login request',
    type: AuthAdditionalDataDTO,
    required: false,
  })
  @IsObject()
  @IsOptional()
  sessionLog?: AuthAdditionalDataDTO;
}

export class UserResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  is_admin: boolean;
}

export class VerifyEmailDto {
  @IsString()
  @IsNotEmpty()
  token: any;
}
