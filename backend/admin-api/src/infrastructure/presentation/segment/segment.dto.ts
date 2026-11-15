import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateSegmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  savedFilter?: any;
}

export class MarkAsCandidateDTO {
  @IsNumber()
  @IsNotEmpty()
  influencerId: number;

  @IsBoolean()
  @IsNotEmpty()
  isMarked: boolean;
}

export class UpdateSegmentDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsOptional()
  savedFilter?: any;
}
