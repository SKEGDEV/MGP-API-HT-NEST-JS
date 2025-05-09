import { IsString, IsInt, IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { mapperPropertiesAuth } from "./property-mapper.dictionary";
import { ApiProperty } from "@nestjs/swagger";


export class LoginRequestDto{

  @ApiProperty(mapperPropertiesAuth.documentNumber)
  @IsString()
  @IsNotEmpty()
  document_number: string;

  @ApiProperty(mapperPropertiesAuth.documentType)
  @IsInt()
  @IsNotEmpty()
  document_type: number;

  @ApiProperty(mapperPropertiesAuth.password)
  @IsString()
  @MaxLength(20)
  @MinLength(8)
  @IsNotEmpty()
  password: string;


}
