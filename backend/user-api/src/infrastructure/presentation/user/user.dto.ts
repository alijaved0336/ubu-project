import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AnswerDTO } from '../quesionnaire/questionnaire.dto';
import {
  BODY_TYPE_OPTIONS,
  FEMININE_STYLES,
  GENDER_OPTIONS,
  MASCULINE_STYLES,
  NON_BINARY_STYLES,
} from 'common/constants';

import {
  IsArray,
  ArrayNotEmpty,
  IsIn,
  ValidateNested,
  IsOptional,
  IsNumber,
  IsString,
  IsDate,
  IsNotEmpty,
  IsInt,
  Min,
} from 'class-validator';

class UserDetailsDto {
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

export class deleteResponseDto {
  statusCode: number;
  message: string;
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

export class UserAnswersDto {
  @ApiProperty({
    description: 'The gender of the user',
    example: ['Male', 'Female', 'Non-binary'],
    isArray: true,
  })
  @IsArray({ message: 'Gender must be an array' })
  @ArrayNotEmpty({ message: 'Gender cannot be an empty array' })
  @IsIn(GENDER_OPTIONS, { each: true, message: 'Invalid gender option' })
  gender: string[];

  @ApiProperty({
    description: 'The shape of the user',
    example: ['🍐 Pear', '🔺 Inverted Triangle'],
    isArray: true,
  })
  @IsArray({ message: 'Shape must be an array' })
  @ArrayNotEmpty({ message: 'Shape cannot be an empty array' })
  @IsIn(BODY_TYPE_OPTIONS, { each: true, message: 'Invalid body shape option' })
  shape: string[];

  @ApiProperty({
    description: 'The life style of the user',
    example: ['Chameleon Style'],
    isArray: true,
  })
  @IsArray({ message: 'Style must be an array' })
  @ArrayNotEmpty({ message: 'Style cannot be an empty array' })
  @IsIn([...MASCULINE_STYLES, ...FEMININE_STYLES, NON_BINARY_STYLES], {
    each: true,
    message: 'Invalid style option',
  })
  style: string[];

  // @ApiProperty({
  //   description: 'The complexion of the user',
  //   example: ['Fair', 'Olive'],
  //   isArray: true,
  // })
  // @IsArray({ message: 'Complexion must be an array' })
  // @ArrayNotEmpty({ message: 'Complexion cannot be an empty array' })
  // @IsIn(BODY_SHADE_OPTIONS, {
  //   each: true,
  //   message: 'Invalid complexion option',
  // })
  // complexion: string[];
}

export class UpdateUserDto {
  @ApiProperty({
    description: 'The first name of the user',
    example: 'Ken',
  })
  @IsString()
  @IsOptional()
  first_name?: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Kanji',
  })
  @IsString()
  @IsOptional()
  last_name?: string;

  @ApiProperty({
    description: 'Photo url',
    example: 'https://atlus.com/wp-content/uploads/2020/06/Avatar-Kanji.jpg',
  })
  @IsOptional()
  @IsString()
  avatar?: string;
  @ApiProperty({
    description: 'Address',
    example: 'Street no 1 House 2',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Phone Number',
    example: '030000000',
  })
  @IsOptional()
  @IsString()
  phone_number?: string;

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

export class UpdateUserDto_new {
  @ApiProperty({ description: 'User details', type: UserDetailsDto })
  @ValidateNested()
  @IsOptional()
  @Type(() => UserDetailsDto)
  user_details?: UserDetailsDto;

  /*   @ApiProperty({ description: 'User answers', type: [AnswerDTO] })
    @Type(() => AnswerDTO)
    @IsOptional()
    @ValidateNested()
    user_answers: AnswerDTO[]; */

  @ApiProperty({ description: 'User body features', type: UserBodyFeatureDto })
  @ValidateNested()
  @IsOptional()
  @Type(() => UserBodyFeatureDto)
  user_body: UserBodyFeatureDto;
}

export class SearchUsersDto {
  @IsString()
  @IsNotEmpty({ message: 'searchString must not be empty' })
  searchString: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
