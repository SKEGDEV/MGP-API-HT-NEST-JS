import { IsNotEmpty, IsInt, IsString } from 'class-validator';
import { mapperPropertiesClassroom } from './property-mapper.dictionary';
import { ApiProperty } from '@nestjs/swagger';

export class requestListToClassroomDto {

  @ApiProperty(mapperPropertiesClassroom.classroomId)
  @IsNotEmpty()
  @IsInt()
  classroomId: number;

  @ApiProperty(mapperPropertiesClassroom.listId)
  @IsNotEmpty()
  @IsInt()
  list_id: number;

  @ApiProperty(mapperPropertiesClassroom.documentNumber)
  @IsNotEmpty()
  @IsString()
  document_id: string;
}
