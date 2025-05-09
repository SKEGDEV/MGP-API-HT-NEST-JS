import { IsEmail, IsNotEmpty, IsString, IsInt, IsDate, MinLength, MaxLength, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { mapperPropertiesAuth } from './property-mapper.dictionary';

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

  @ApiProperty(mapperPropertiesAuth.firstName)
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty(mapperPropertiesAuth.lastName)
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty(mapperPropertiesAuth.schoolName)
  @IsString()
  @IsNotEmpty()
  school_name: string;

  @ApiProperty(mapperPropertiesAuth.schoolDirection)
  @IsString()
  @IsNotEmpty()
  school_direction: string;

  @ApiProperty(mapperPropertiesAuth.birthday)
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  birthday: Date;

  @ApiProperty(mapperPropertiesAuth.password)
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @ApiProperty(mapperPropertiesAuth.documentNumber)
  @IsString()
  @IsNotEmpty()
  document_number: string;

  @ApiProperty(mapperPropertiesAuth.email)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty(mapperPropertiesAuth.phoneNumber)
  @IsInt()
  @IsNotEmpty()
  phone_number: number;

  @ApiProperty(mapperPropertiesAuth.documentType)
  @IsInt()
  @IsNotEmpty()
  document_type: number;

}


