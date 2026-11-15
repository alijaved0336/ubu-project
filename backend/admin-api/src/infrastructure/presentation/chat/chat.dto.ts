import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class SpecificChatDTO {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  chatId: number;

}