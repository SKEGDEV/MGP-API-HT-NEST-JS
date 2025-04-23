import { IsOptional, IsString, IsInt, IsBoolean } from "class-validator";


export class ErrorDto{

  @IsBoolean()
  @IsOptional()
  success: boolean = true;

  @IsString()
  @IsOptional()
  message: string = '';

  @IsString()
  @IsOptional()
  errorCode: string = '';

  @IsString()
  @IsOptional()
  errorDetails: string = '';

  @IsInt()
  @IsOptional()
  statusCode: number = 200;

}

