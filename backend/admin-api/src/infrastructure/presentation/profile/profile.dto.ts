import {
  IsString,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsInt,
  IsPositive,
  ValidateIf,
  IsEmail,
  Length,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { UserRole } from '@infrastructure/orm/entities/user.entity';
import { PartialType, PickType } from '@nestjs/mapped-types';
import { RelationType } from '@infrastructure/orm/entities/profile.entity';


// Request DTOs
export class CreateProfileDto {


  @ApiProperty({
    description: 'Relationship to the parent user',
    enum: RelationType,
    example: RelationType.DAUGHTER,
  })
  @IsEnum(RelationType)
  @IsNotEmpty()
  relation: RelationType;

  @ApiPropertyOptional({
    description: 'Whether the profile is active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateProfileDto {


  @ApiProperty({
    description: 'Relationship to the parent user',
    enum: RelationType,
    example: RelationType.DAUGHTER,
  })
  @IsOptional()
  @IsEnum(RelationType)
  relation: RelationType;


  @ApiPropertyOptional({
    description: 'Whether the profile is active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class LinkChildUserDto {
  @ApiProperty({
    description: 'Child user ID to link to the profile',
    example: 2,
  })
  @IsInt()
  @IsPositive()
  child_user_id: number;
}

export class GetProfilesQueryDto {
  @ApiPropertyOptional({
    description: 'Include child user details',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  include_child_details?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  active_only?: boolean;

  @ApiPropertyOptional({
    description: 'Filter profiles with linked child users',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  has_child_user?: boolean;
}

// Response DTOs
export class UserSummaryDto {
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  email: string;

  @ApiPropertyOptional({
    description: 'User first name',
    example: 'John',
  })
  first_name?: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Doe',
  })
  last_name?: string;

  @ApiPropertyOptional({
    description: 'Full name (computed)',
    example: 'John Doe',
  })
  full_name?: string;

  @ApiPropertyOptional({
    description: 'Avatar',
    example: 'https://example.com/avatar.jpg',
  })
  avatar?: string;
}

export class ProfileSummaryDto {
  @ApiProperty({
    description: 'Profile ID',
    example: 1,
  })
  id: number;


  @ApiProperty({
    description: 'Relationship to the parent user',
    example: 'child',
  })
  relation: string;

  @ApiProperty({
    description: 'Whether the profile is active',
    example: true,
  })
  is_active: boolean;

  @ApiProperty({
    description: 'Whether profile has a linked child user',
    example: false,
  })
  has_child_user: boolean;

  @ApiProperty({
    description: 'Profile creation date',
    example: '2024-01-15T10:30:00Z',
  })
  created_at: string;
}

// export class ProfileDetailDto {
//   @ApiProperty({
//     description: 'Profile ID',
//     example: 1,
//   })
//   id: number;



//   @ApiProperty({
//     description: 'Relationship to the parent user',
//     example: 'child',
//   })
//   relation: string;

//   @ApiProperty({
//     description: 'Whether the profile is active',
//     example: true,
//   })
//   is_active: boolean;

//   @ApiProperty({
//     description: 'Parent user ID',
//     example: 1,
//   })
//   parent_user_id: number;

//   @ApiPropertyOptional({
//     description: 'Child user ID (if linked)',
//     example: 2,
//   })
//   child_user_id?: number;

//   @ApiProperty({
//     description: 'Profile creation date',
//     example: '2024-01-15T10:30:00Z',
//   })
//   created_at: string;

//   @ApiProperty({
//     description: 'Profile last update date',
//     example: '2024-01-20T14:45:00Z',
//   })
//   updated_at: string;

//   @ApiPropertyOptional({
//     description: 'Parent user details',
//     type: UserSummaryDto,
//   })
//   parent_user?: UserSummaryDto;

//   @ApiPropertyOptional({
//     description: 'Child user details (if linked)',
//     type: UserSummaryDto,
//   })
//   child_user?: UserSummaryDto;

//   @ApiProperty({
//     description: 'Whether profile has a linked child user',
//     example: false,
//   })
//   has_child_user: boolean;
// }

export class ProfileInfoDto {
  @ApiProperty({
    description: 'Profile ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Relationship to the parent user',
    example: RelationType.DAUGHTER,
  })
  relation: RelationType;

  @ApiProperty({
    description: 'Whether the profile is active',
    example: true,
  })
  is_active: boolean;

  @ApiProperty({
    description: 'Parent user ID',
    example: 1,
  })
  parent_user_id: number;

  @ApiPropertyOptional({
    description: 'Child user ID (if linked)',
    example: 2,
  })
  child_user_id?: number;

  @ApiProperty({
    description: 'Profile creation date',
    example: '2024-01-15T10:30:00Z',
  })
  created_at: string;

  @ApiProperty({
    description: 'Profile last update date',
    example: '2024-01-20T14:45:00Z',
  })
  updated_at: string;

  @ApiPropertyOptional({
    description: 'Child user details (if linked)',
    type: UserSummaryDto,
  })
  child_user?: UserSummaryDto;

  @ApiProperty({
    description: 'Whether profile has a linked child user',
    example: false,
  })
  has_child_user: boolean;
}

export class ProfileParentDto {
  @ApiPropertyOptional({
    description: 'Parent user details',
    type: UserSummaryDto,
  })
  parent_user?: UserSummaryDto;
}

export class ProfileDetailDto {
  @ApiProperty({
    type: ProfileInfoDto,
  })
  profile: ProfileInfoDto;

  @ApiProperty({
    type: ProfileParentDto,
  })
  @IsOptional()
  parent?: ProfileParentDto;
}

export class ProfileFinalDetailDto {
  @ApiProperty({
    type: [ProfileInfoDto],
  })
  profiles: Partial<ProfileInfoDto>[];

  @ApiProperty({
    type: ProfileParentDto,
  })
  parent?: ProfileParentDto;
}

export class ProfileStatsDto {
  @ApiProperty({
    description: 'Total number of profiles',
    example: 3,
  })
  total_profiles: number;

  @ApiProperty({
    description: 'Number of active profiles',
    example: 3,
  })
  active_profiles: number;

  @ApiProperty({
    description: 'Number of profiles with linked child users',
    example: 1,
  })
  profiles_with_child_users: number;

  @ApiProperty({
    description: 'Number of profiles without linked child users',
    example: 2,
  })
  profiles_without_child_users: number;

  @ApiProperty({
    description: 'Maximum profiles allowed',
    example: 5,
  })
  max_profiles_allowed: number;

  @ApiProperty({
    description: 'Remaining profile slots',
    example: 2,
  })
  remaining_slots: number;
}

// API Response DTOs
export class ApiResponseDto<T> {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Operation completed successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Response data',
  })
  data?: T;

  @ApiPropertyOptional({
    description: 'Error details (if any)',
  })
  error?: any;

  @ApiProperty({
    description: 'Response timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  timestamp: string;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Data retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Response data array',
    isArray: true,
  })
  data: T[];

  @ApiProperty({
    description: 'Pagination metadata',
  })
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };

  @ApiProperty({
    description: 'Response timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  timestamp: string;
}

// Error Response DTOs
export class ErrorResponseDto {
  @ApiProperty({
    description: 'Success status',
    example: false,
  })
  success: boolean;

  @ApiProperty({
    description: 'Error message',
    example: 'Profile not found',
  })
  message: string;

  @ApiProperty({
    description: 'Error code',
    example: 'PROFILE_NOT_FOUND',
  })
  error_code: string;

  @ApiPropertyOptional({
    description: 'Validation errors (if any)',
    isArray: true,
  })
  validation_errors?: string[];

  @ApiProperty({
    description: 'Response timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  timestamp: string;
}

export class ProfileResponseDto {
  @ApiProperty({
    description: 'Profile ID',
    example: 1,
  })
  id: number;


  @ApiProperty({
    description: 'Relationship to the parent user',
    example: RelationType.DAUGHTER,
  })
  relation: RelationType;

  @ApiPropertyOptional({
    description: 'Date of birth of the profile',
    example: '2010-05-15',
    type: 'string',
    format: 'date',
  })
  date_of_birth?: Date;

  @ApiProperty({
    description: 'Whether the profile is active',
    example: true,
  })
  is_active: boolean;

  @ApiProperty({
    description: 'Parent user ID',
    example: 1,
  })
  parent_user_id?: number;

  @ApiPropertyOptional({
    description: 'Child user ID (if linked)',
    example: 2,
  })
  child_user_id?: number;

  @ApiProperty({
    description: 'Profile creation date',
    example: '2024-01-15T10:30:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Profile last update date',
    example: '2024-01-20T14:45:00Z',
  })
  updated_at: Date;

  @ApiPropertyOptional({
    description: 'Parent user details',
    type: UserSummaryDto,
  })
  parent_user?: UserSummaryDto;

  @ApiPropertyOptional({
    description: 'Child user details (if linked)',
    type: UserSummaryDto,
  })
  child_user?: UserSummaryDto;
}

export class UserSignUpDTO {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  @ValidateIf((obj) => !obj.isDependant)
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
  @ValidateIf((obj) => !obj.isDependant)
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

    @IsBoolean()
  @ApiProperty({ type: Boolean, example: true, description: 'Whether this user is a dependant (child profile)' })
  isDependant: boolean;
}

export class CombinedUserProfileDto {
  @ApiProperty({ type: UserSignUpDTO })
  @ValidateNested()
  @Type(() => UserSignUpDTO)
  user: UserSignUpDTO;

  @ApiProperty({ type: CreateProfileDto })
  @ValidateNested()
  @Type(() => CreateProfileDto)
  profile: CreateProfileDto;
}

export class PartialUserNameDTO extends PickType(UserSignUpDTO, [
  'first_name',
  'last_name',
] as const) {}

export class UpdatedCombinedUserProfileDTO {
  @ApiProperty({ type: PartialUserNameDTO, required: false })
  @ValidateNested()
  @IsOptional()
  @Type(() => PartialUserNameDTO)
  user?: PartialUserNameDTO;

  @ApiProperty({ type: CreateProfileDto, required: false })
  @ValidateNested()
  @IsOptional()
  @Type(() => CreateProfileDto)
  profile?: CreateProfileDto;
}
