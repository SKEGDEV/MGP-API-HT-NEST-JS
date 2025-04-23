import { IsEmail, IsNotEmpty, IsString, IsInt, IsDate, MinLength, MaxLength, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class SessionResponseDto{
  @IsString()
  @IsOptional()
  message: string = '';

  @IsString()
  @IsOptional()
  name: string = '';

  @IsString()
  @IsOptional()
  document_number: string = '';

  @IsString()
  @IsOptional()
  token: string = '';
}

export class CreateAccountRequestDto{

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  school_name: string;

  @IsString()
  @IsNotEmpty()
  school_direction: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  birthday: Date;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @IsString()
  @IsNotEmpty()
  document_number: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsInt()
  @IsNotEmpty()
  phone_number: number;

  @IsInt()
  @IsNotEmpty()
  document_type: number;

}


