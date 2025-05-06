import { IsNotEmpty, IsInt, IsString } from 'class-validator';

export class requestListToClassroomDto {

  @IsNotEmpty()
  @IsInt()
  classroomId: number;
  @IsNotEmpty()
  @IsInt()
  list_id: number;
  @IsNotEmpty()
  @IsString()
  document_id: string;
}
