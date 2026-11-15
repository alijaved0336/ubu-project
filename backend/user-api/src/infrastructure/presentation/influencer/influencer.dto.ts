import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class InfluncerIdDTO {
  @ApiProperty({
    description: 'The ID of the influencer',
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  influncer_id: string;
}
export interface MeasurementFilter {
  minHeight?: string;
  maxHeight?: string;
  minWeight?: string;
  maxWeight?: string;
}

export interface ParsedMeasurementFilter {
  minHeight?: number;
  maxHeight?: number;
  minWeight?: number;
  maxWeight?: number;
}

export interface BudgetAnswersFilter {
  selectedOptions?: string[];
}

export interface ParsedBudgetAnswersFilter {
  selectedOptions?: string[];
}

export interface StylesAnswersFilter {
  selectedOptions?: string[];
}

export interface ParsedStylesAnswersFilter {
  selectedOptions?: string[];
}

export interface HobbiesAnswersFilter {
  selectedOptions?: string[];
}

export interface ParsedHobbiesAnswersFilter {
  selectedOptions?: string[];
}

export interface SportsAnswersFilter {
  selectedOptions?: string[];
}

export interface ParsedSportsAnswersFilter {
  selectedOptions?: string[];
}

export interface LocationAnswersFilter {
  selectedOptions?: string[];
}

export interface ParsedLocationAnswersFilter {
  selectedOptions?: string[];
}

export interface BodyShapeAnswersFilter {
  selectedOptions?: string[];
}

export interface ParsedBodyShapeAnswersFilter {
  selectedOptions?: string[];
}

export class MeasurementFilterDto {
  @IsOptional()
  @ApiProperty({ example: '1500' })
  minHeight?: string;

  @IsOptional()
  @ApiProperty({ example: '1600' })
  maxHeight?: string;

  @IsOptional()
  @ApiProperty({ example: '45' })
  minWeight?: string;

  @IsOptional()
  @ApiProperty({ example: '60' })
  maxWeight?: string;
}

export class BudgetFilterDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ 
    example: ['Style A', 'Style B', 'Budget Range 1'],
    description: 'Array of selected options to filter by',
    type: [String]
  })
  selectedOptions?: string[];
}

export class StylesFilterDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ 
    example: ['Casual', 'Formal', 'Sporty', 'Bohemian'],
    description: 'Array of style options to filter by',
    type: [String]
  })
  selectedOptions?: string[];
}

export class HobbiesFilterDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ 
    example: ['Reading', 'Cooking', 'Photography', 'Traveling'],
    description: 'Array of hobbies and interests to filter by',
    type: [String]
  })
  selectedOptions?: string[];
}

export class SportsFilterDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ 
    example: ['Soccer', 'Basketball', 'Tennis', 'Swimming'],
    description: 'Array of sports to filter by',
    type: [String]
  })
  selectedOptions?: string[];
}

export class LocationFilterDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ 
    example: ['North America', 'Europe', 'Asia', 'Australia'],
    description: 'Array of location/geographic regions to filter by',
    type: [String]
  })
  selectedOptions?: string[];
}

export class BodyShapeFilterDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ 
    example: ['Pear', 'Apple', 'Hourglass', 'Rectangle'],
    description: 'Array of body shapes to filter by',
    type: [String]
  })
  selectedOptions?: string[];
}

export class FetchFilteredInfluencersDto {
  @ApiProperty({
    description: 'Measurement filter',
    type: MeasurementFilterDto,
    required: false,
  })
  @IsOptional()
  measurementFilter?: MeasurementFilterDto;

  @ApiProperty({
    description: 'Budget answers filter',
    type: BudgetFilterDto,
    required: false,
  })
  @IsOptional()
  budgetAnswersFilter?: BudgetFilterDto;

  @ApiProperty({
    description: 'Styles answers filter',
    type: StylesFilterDto,
    required: false,
  })
  @IsOptional()
  stylesAnswersFilter?: StylesFilterDto;

  @ApiProperty({
    description: 'Hobbies and interests answers filter',
    type: HobbiesFilterDto,
    required: false,
  })
  @IsOptional()
  hobbiesAnswersFilter?: HobbiesFilterDto;

  @ApiProperty({
    description: 'Sports answers filter',
    type: SportsFilterDto,
    required: false,
  })
  @IsOptional()
  sportsAnswersFilter?: SportsFilterDto;

  @ApiProperty({
    description: 'Location answers filter',
    type: LocationFilterDto,
    required: false,
  })
  @IsOptional()
  locationAnswersFilter?: LocationFilterDto;

  @ApiProperty({
    description: 'Body shape answers filter',
    type: BodyShapeFilterDto,
    required: false,
  })
  @IsOptional()
  bodyShapeAnswersFilter?: BodyShapeFilterDto;
}
