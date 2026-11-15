import { UserType } from '@infrastructure/orm/entities/questionnaire.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class AnswerDTO {
  @ApiProperty({
    description: 'The ID of the question',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  question: number;

  @ApiProperty({
    description: 'The srNo of the question',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  srNo: number;

  @ApiProperty({
    description: 'The selected options for the question',
    type: [String],
    example: ['18-24'],
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  selected_options: string[];
}

export class UserSelectionDTO {
  @ApiProperty({
    description: 'An array of answers to the questionnaire',
    type: [AnswerDTO],
  })
  @IsNotEmpty()
  @IsArray()
  answers: AnswerDTO[];
}

export class DropdownOptionsQueryDto {
  @ApiProperty({
    description: 'The role for which dropdowns are required',
    example: 'consumer',
    enum: UserType,
  })
  @IsEnum(UserType)
  userType: UserType;
}
