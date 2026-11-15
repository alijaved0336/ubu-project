import { Page } from '@infrastructure/orm/entities/subscriber.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateContactUs {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  email: string;

  @IsString()
  your_question: string;
}

export class InstagramCreatePostDto {
  @IsString()
  @IsNotEmpty()
  image_link: string;

  @IsString()
  @IsNotEmpty()
  caption: string;
}

export class SubsciberMailDto {
  @IsEmail({}, { message: 'please enter a valid email address' })
  @IsOptional()
  email: string;

  @IsEnum(Page, { message: 'page must be either landing or ios' })
  page: Page;
}

export class SubsciberPhoneDto {
  // @IsPhoneNumber()
  @IsNotEmpty()
  phone_number: string;

  @IsEnum(Page, { message: 'page must be either landing or ios' })
  page: Page;
}

export class PaginationDto {
  @ApiProperty({
    name: 'page',
    required: true,
  })
  // @IsOptional()
  @Type(() => Number)
  @IsInt()
  page: number = 1;

  @ApiProperty({
    name: 'limit',
    required: true,
  })
  // @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit: number = 10;

  @ApiProperty({
    name: 'search',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
