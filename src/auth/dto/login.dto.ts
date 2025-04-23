import { IsString, IsInt, IsNotEmpty, MaxLength, MinLength } from "class-validator";


export class LoginRequestDto{

  @IsString()
  @IsNotEmpty()
  document_number: string;

  @IsInt()
  @IsNotEmpty()
  document_type: number;

  @IsString()
  @MaxLength(20)
  @MinLength(8)
  @IsNotEmpty()
  password: string;


}
