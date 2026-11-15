import { IsString, IsOptional, IsNotEmpty, IsInt, IsDecimal, IsDate, IsNumber, IsBoolean, ValidateNested, IsArray, IsObject, Min } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class EventDetailDto {
  @IsNumber()
  @IsOptional()
  questionId: number;

  @IsString()
  @IsOptional()
  answer: string;
}

export class InfluencerAdditionalDto {
  @IsOptional()
  @IsString()
  'Style and Personality': EventDetailDto;

  @IsOptional()
  @IsString()
  'Budget': EventDetailDto;

  @IsOptional()
  @IsString()
  'Age': EventDetailDto;

  @IsOptional()
  @IsString()
  'Location/Geographic Region': EventDetailDto;

  @IsOptional()
  @IsString()
  'Languages': EventDetailDto;

  @IsOptional()
  @IsString()
  'Weddings': EventDetailDto;

  @IsOptional()
  @IsString()
  'Formal Events': EventDetailDto;

  @IsOptional()
  @IsString()
  'Professional Events': EventDetailDto;

  @IsOptional()
  @IsString()
  'Social Gatherings': EventDetailDto;

  @IsOptional()
  @IsString()
  'Holidays and Special Occasions': EventDetailDto;

  @IsOptional()
  @IsString()
  'Themed Parties': EventDetailDto;

  @IsOptional()
  @IsString()
  'Concerts': EventDetailDto;

  @IsOptional()
  @IsString()
  'Family Events': EventDetailDto;

  @IsOptional()
  @IsString()
  'Ethnicity': EventDetailDto;

  @IsOptional()
  @IsString()
  'Sporting Events': EventDetailDto;

  @IsOptional()
  @IsString()
  'Cultural and Community Events': EventDetailDto;

  @IsOptional()
  @IsString()
  'Religious Events': EventDetailDto;

  @IsOptional()
  @IsString()
  'Educational Events': EventDetailDto;

  @IsOptional()
  @IsString()
  'Special Personal Occasions': EventDetailDto;

  @IsOptional()
  @IsString()
  'Travel and Destination Events': EventDetailDto;

  @IsOptional()
  @IsString()
  'Fashion and Beauty Events': EventDetailDto;

  @IsOptional()
  @IsString()
  'Outdoor Events': EventDetailDto;
}

export class InfluencerDTO {
  @IsOptional()
  @IsString()
  tiktok_handle: string;

  @IsOptional()
  @IsString()
  instagram_handle: string;

  @IsOptional()
  @IsString()
  facebook_handle: string;

  @IsOptional()
  @IsString({ each: true })
  gallery_images: string[];

  @IsOptional()
  @IsInt()
  following: number;

  @IsOptional()
  @IsDecimal()
  engagment_rate: number;

  @IsOptional()
  @IsDecimal()
  conversion_rate: number;

  @IsOptional()
  @IsDecimal()
  rating: number;

  @IsOptional()
  @IsString()
  avgResponseTime: string; // Assuming time is stored as a string in HH:MM:SS format

  @IsOptional()
  @IsString()
  bio: string; // bio of the influencer

  @IsOptional()
  @IsString()
  profilePictureUrl: string;

  @IsOptional()
  @IsInt()
  reviewsCount: number;

  @IsOptional()
  @IsDecimal()
  bustGirth: number;

  @IsOptional()
  @IsDecimal()
  underbustGirth: number;

  @IsOptional()
  @IsDecimal()
  upperchestGirth: number;

  @IsOptional()
  @IsString()
  complexation: string;

  @IsOptional()
  @IsString()
  height: string;

  @IsOptional()
  @IsDecimal()
  weight: number;

  @IsOptional()
  @IsString()
  shape: string;

  @IsOptional()
  @IsString()
  budget: string;

  @IsOptional()
  @IsString()
  region: string;

  @IsOptional()
  @IsString()
  gender: string;

  @IsOptional()
  @IsString({ each: true })
  style: string[]; // e.g ['Petite', 'Active', 'Boho', 'Traditional']

  @IsOptional()
  @IsInt()
  ff: number;

  @IsOptional()
  @IsString()
  sports: string;

  @IsOptional()
  @IsString()
  audience_region: string;

  @IsOptional()
  @IsDate()
  dob: Date;

  @IsOptional()
  @IsInt()
  influencerId: number; // Reference to influencers.id

  @IsOptional()
  @IsDate()
  lastUpdated: Date;
}
export class PartialInfluencerDTO extends PartialType(InfluencerDTO) {}

export class MarkAsPotentialDTO {
  @IsNumber()
  @IsNotEmpty()
  brandId: number;

  @IsBoolean()
  @IsNotEmpty()
  isMarked: boolean;
}

export class MeasurementDto {
  @ApiProperty({
    description: 'The waist Girth of the user',
    example: 1753,
  })
  @IsOptional()
  @IsNumber({}, { message: 'waist Girth must be a number' })
  waistGirth?: number;

  // @ApiProperty({
  //   description: 'The waist height of the user',
  //   example: 1753,
  // })
  // @IsOptional()
  // @IsNumber({}, { message: 'waist Height must be a number' })
  // waistHeight?: number;
}

class UserDetailsDto {
  @ApiProperty({ description: 'The first name of the user', example: 'Ken' })
  @IsString()
  first_name: string;

  @ApiProperty({ description: 'The last name of the user', example: 'Kanji' })
  @IsString()
  last_name: string;

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
}

export class UserBodyFeatureDto {
  @ApiProperty({
    description: 'The height of the user',
    example: 1753,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Height must be a number' })
  height?: number;

  @ApiProperty({
    description: 'The weight of the user',
    example: 12313,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Weight must be a number' })
  weight?: number;

  @ApiProperty({
    description: 'The age of the user',
    example: 100,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Age must be a number' })
  age?: number;

  @ApiProperty({ description: 'User body Measurments', type: MeasurementDto })
  @ValidateNested()
  @IsOptional()
  @Type(() => MeasurementDto)
  measurment?: MeasurementDto;
}

export class UpdateInfluencerProfileDto {
  @ApiProperty({ description: 'User details', type: UserDetailsDto })
  @ValidateNested()
  @Type(() => UserDetailsDto)
  user_details: UserDetailsDto;

  @ApiProperty({ description: 'User body features', type: UserBodyFeatureDto })
  @ValidateNested()
  @IsOptional()
  @Type(() => UserBodyFeatureDto)
  user_body: UserBodyFeatureDto;
}

// Update Measuremnt DTOs START

export class MeasurementsColumnDto {
  @ApiProperty({ example: 'Chest', description: 'Name of the measurement' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'mm', description: 'Unit of the measurement' })
  @IsString()
  unit: string;

  @ApiProperty({ example: 95.5, description: 'Value of the measurement' })
  @IsNumber()
  @IsOptional()
  value?: number;
}

export class InputColumnDto {
  @ApiProperty({ example: 30, description: 'Age of the person' })
  @IsNumber()
  age: number;

  @ApiProperty({ example: 'female', description: 'Gender' })
  @IsString()
  gender: string;

  @ApiProperty({ example: 1752, description: 'Height in mm' })
  @IsNumber()
  height: number;

  @ApiProperty({ example: 68039, description: 'Weight in grams' })
  @IsNumber()
  weight: number;

  @ApiProperty({ example: 'base64string...', description: 'Front photo as base64 or URL', required: false })
  @IsOptional()
  @IsString()
  frontPhoto?: string;

  @ApiProperty({ example: 'base64string...', description: 'Right-side photo as base64 or URL', required: false })
  @IsOptional()
  @IsString()
  rightPhoto?: string;
}

export class UpdateMeasurementDto {
  @IsObject()
  @ValidateNested()
  @Type(() => InputColumnDto)
  input: InputColumnDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MeasurementsColumnDto)
  measurements: MeasurementsColumnDto[];

  @ApiProperty({ example: 1702, description: 'Age must be a number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  age?: number;
}

export class CreateScanDto {
  @ApiProperty({ example: 'male' })
  @IsString()
  gender: string;

  @ApiProperty({ example: 1702, description: 'Age must be a number' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  age: number;

  @ApiProperty({ example: 1702, description: 'Height in millimeters' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  height: number;

  @ApiProperty({ example: 77111, description: 'Weight in grams' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  weight: number;

  @ApiProperty({ example: 988, description: 'Outseam (right) in millimeters' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  outseamR: number;

  @ApiProperty({ example: 592, description: 'Thigh girth (right) in millimeters' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  thighGirthR: number;

  @ApiProperty({ example: 919, description: 'Belly waist girth in millimeters' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  bellyWaistGirth: number;

  @ApiProperty({ example: 1006, description: 'Bust girth in millimeters' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  bustGirth: number;

  @ApiProperty({ example: 988, description: 'Hip girth in millimeters' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  hipGirth: number;

  @ApiProperty({ example: 584, description: 'Outer arm length (right) in millimeters' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  outerArmLengthR: number;

  @ApiProperty({ example: 480, description: 'Across back shoulder width in millimeters' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  acrossBackShoulderWidth: number;

  @ApiProperty({ example: 905, description: 'Waist girth in millimeters' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  waistGirth: number;
}
