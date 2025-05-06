import { IsNotEmpty, IsString, IsInt } from 'class-validator'; 

export class requestCreateClassroomDto{

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  classroom_type: number;

  @IsString()
  @IsNotEmpty()
  document_number: string;

}

