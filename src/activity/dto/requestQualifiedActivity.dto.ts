import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsNumber,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { mapperPropertiesActivity } from "./property-mapper.dictionary";

export class QualifyingDto{
  @ApiProperty(mapperPropertiesActivity.studentQualification)
  @IsNumber()
  @IsNotEmpty()
  studentQualification: number;

  @ApiProperty(mapperPropertiesActivity.activityCurrentQualification)
  @IsNumber()
  @IsNotEmpty()
  studentCurrentQualification: number;

  @ApiProperty(mapperPropertiesActivity.qualificationActivity)
  @IsNumber()
  @IsNotEmpty()
  activityQualification: number;

  @ApiProperty(mapperPropertiesActivity.qualificationName)
  @IsString()
  @IsNotEmpty()
  qualificationName: string;
  
}

export class qualificationDto{

  @ApiProperty(mapperPropertiesActivity.qualficationType)
  @IsInt()
  @IsNotEmpty()
  typeId: number;

  @ApiProperty(mapperPropertiesActivity.activityStudentId)
  @IsInt()
  @IsNotEmpty()
  activityStudentId: number;
}

export class requestQualficateActivityDto{
  @Type(() => QualifyingDto)
  @ValidateNested()
  qualfication: qualificationDto;

  @Type(() => QualifyingDto)
  @ValidateNested()
  attitudinal: QualifyingDto;

  @Type(() => QualifyingDto)
  @ValidateNested()
  procedural: QualifyingDto;

  @Type(() => QualifyingDto)
  @ValidateNested()
  declarative: QualifyingDto;
}
