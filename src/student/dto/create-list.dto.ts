import { IsNotEmpty, IsInt, IsString, IsDate, IsOptional, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { mapperPropertiesStudent } from "./student-mapper.dictionary";
import { ApiProperty } from "@nestjs/swagger";

export class StudentDto{

  @ApiProperty(mapperPropertiesStudent.firstName)
  @IsString()
  @IsNotEmpty()
  student_firstName: string;

  @ApiProperty(mapperPropertiesStudent.lastName)
  @IsString()
  @IsNotEmpty()
  student_lastName: string;

  @ApiProperty(mapperPropertiesStudent.studentCode)
  @IsString()
  @IsNotEmpty()
  student_code: string;

  @ApiProperty(mapperPropertiesStudent.studentListId)
  @IsInt()
  @IsOptional()
  student_listId: number;

  @ApiProperty(mapperPropertiesStudent.studentStatusId)
  @IsInt()
  @IsNotEmpty()
  student_statusId: number;

  @ApiProperty(mapperPropertiesStudent.studentBirthday)
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  student_birthday: Date;

  @ApiProperty(mapperPropertiesStudent.studentMotherNumber)
  @IsString()
  @IsOptional()
  student_motherNumber: string;

  @ApiProperty(mapperPropertiesStudent.studentFatherNumber)
  @IsString()
  @IsOptional()
  student_fatherNumber: string;

  @ApiProperty(mapperPropertiesStudent.studentPhoneNumber)
  @IsString()
  @IsOptional()
  student_phoneNumber: string;
}

export class CreateListRequestDto{
  @ApiProperty(mapperPropertiesStudent.gradeId)
  @IsInt()
  @IsNotEmpty()
  in_grade_id: number;

  @ApiProperty(mapperPropertiesStudent.sectionId)
  @IsInt()
  @IsNotEmpty()
  in_section_id: number;


  @ApiProperty(mapperPropertiesStudent.levelId)
  @IsInt()
  @IsNotEmpty()
  in_level_id: number;

  @ApiProperty(mapperPropertiesStudent.documentNumber)
  @IsString()
  @IsNotEmpty()
  document_number: string;

  @ApiProperty({ type: StudentDto, ...mapperPropertiesStudent.studentList})
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentDto)
  students: StudentDto[];
}

export class StudentUpdateDto{
  @ApiProperty(mapperPropertiesStudent.studentId)
  @IsInt()
  @IsNotEmpty()
  s_id: number;

  @ApiProperty(mapperPropertiesStudent.firstName)
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty(mapperPropertiesStudent.lastName)
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty(mapperPropertiesStudent.studentCode)
  @IsString()
  @IsNotEmpty()
  s_code: string;

  @ApiProperty(mapperPropertiesStudent.studentBirthday)
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  birthday: Date;

  @ApiProperty(mapperPropertiesStudent.studentMotherNumber)
  @IsString()
  @IsOptional()
  mother_number: string;

  @ApiProperty(mapperPropertiesStudent.studentFatherNumber)
  @IsString()
  @IsOptional()
  father_number: string;

  @ApiProperty(mapperPropertiesStudent.studentPhoneNumber)
  @IsString()
  @IsOptional()
  phone_number: string;

  @ApiProperty(mapperPropertiesStudent.documentNumber)
  @IsString()
  @IsNotEmpty()
  doc_number: string;
}
