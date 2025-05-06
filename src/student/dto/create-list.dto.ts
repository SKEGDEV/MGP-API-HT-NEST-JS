import { IsNotEmpty, IsInt, IsString, IsDate, IsOptional, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class StudentDto{

  @IsString()
  @IsNotEmpty()
  student_firstName: string;

  @IsString()
  @IsNotEmpty()
  student_lastName: string;

  @IsString()
  @IsNotEmpty()
  student_code: string;

  @IsInt()
  @IsOptional()
  student_listId: number;

  @IsInt()
  @IsNotEmpty()
  student_statusId: number;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  student_birthday: Date;

  @IsString()
  @IsOptional()
  student_motherNumber: string;

  @IsString()
  @IsOptional()
  student_fatherNumber: string;

  @IsString()
  @IsOptional()
  student_phoneNumber: string;
}

export class CreateListRequestDto{
  @IsInt()
  @IsNotEmpty()
  in_grade_id: number;

  @IsInt()
  @IsNotEmpty()
  in_section_id: number;

  @IsInt()
  @IsNotEmpty()
  in_level_id: number;

  @IsString()
  @IsNotEmpty()
  document_number: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentDto)
  students: StudentDto[];
}

export class StudentUpdateDto{
  @IsInt()
  @IsNotEmpty()
  s_id: number;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  s_code: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  birthday: Date;

  @IsString()
  @IsOptional()
  mother_number: string;

  @IsString()
  @IsOptional()
  father_number: string;

  @IsString()
  @IsOptional()
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  doc_number: string;
}
