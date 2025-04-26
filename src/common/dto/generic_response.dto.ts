import { IsOptional, IsString, IsBoolean, IsDate } from "class-validator";
import { Type } from "class-transformer";

export class GenericResponseDto{
  @IsBoolean()
  @IsOptional()
  success: boolean = true;

  @IsString()
  @IsOptional()
  message: string = '';

  @Type(() => Date)
  @IsDate()
  excecution_date: Date = new Date();
}

