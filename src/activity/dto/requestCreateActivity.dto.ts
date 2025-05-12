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

class QualificationDto{
  @ApiProperty(mapperPropertiesActivity.qualificationActivity)
  @IsNumber()
  @IsNotEmpty()
  qualification: number;
  
  @ApiProperty(mapperPropertiesActivity.qualificationName)
  @IsString()
  @IsNotEmpty()
  name: string;
}

class ActivityDto{
  @ApiProperty(mapperPropertiesActivity.classroomListId)
  @IsInt()
  @IsNotEmpty()
  classroomListId: number;

  @ApiProperty(mapperPropertiesActivity.subTypeId)
  @IsInt()
  @IsNotEmpty()
  subTypeId: number;

  @ApiProperty(mapperPropertiesActivity.unitNumber)
  @IsInt()
  @IsNotEmpty()
  unitNumber: number;
}

export class requestCreateActivityDto{
  
  @Type(() => QualificationDto)
  @ValidateNested()
  declarative: QualificationDto;
  
  @Type(() => QualificationDto)
  @ValidateNested()
  attitudinal: QualificationDto;

  @Type(() => QualificationDto)
  @ValidateNested()
  procedural: QualificationDto;

  @Type(() => ActivityDto)
  @ValidateNested()
  activity: ActivityDto;

}
