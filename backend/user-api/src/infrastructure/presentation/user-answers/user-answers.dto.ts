import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SurveyAnswerDto {
  @IsString()
  questionId: string;

  @IsArray()
  @IsString({ each: true })
  answer: string[];

  @IsString()
  srNo: string;
}

export class SurveysDto {
  @ValidateNested({ each: true })
  @Type(() => SurveyAnswerDto)
  surveys: Record<string, SurveyAnswerDto>;
}
