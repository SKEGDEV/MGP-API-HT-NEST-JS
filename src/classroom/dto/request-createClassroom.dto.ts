import { IsNotEmpty, IsString, IsInt } from 'class-validator'; 
import { ApiProperty } from '@nestjs/swagger';
import { mapperPropertiesClassroom } from './property-mapper.dictionary';

export class requestCreateClassroomDto{

  @ApiProperty(mapperPropertiesClassroom.nameClassroom)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty(mapperPropertiesClassroom.classroomType)
  @IsInt()
  @IsNotEmpty()
  classroom_type: number;

  @ApiProperty(mapperPropertiesClassroom.documentNumber)
  @IsString()
  @IsNotEmpty()
  document_number: string;

}

