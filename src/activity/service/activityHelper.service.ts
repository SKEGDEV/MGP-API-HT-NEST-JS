import { Injectable, HttpStatus } from "@nestjs/common";
import { SqlService } from "src/common/database/sql.service";
import { Tools } from "src/common/utils/tools.util";
import { HandleErrors } from "src/common/decorators/handle-errors.decorator";
import { CustomHttpException } from "src/common/exceptions/custom-http.exception";
import { ErrorCodeMap } from "src/common/constants";
import {
  requestCreateActivityDto,
  requestQualficateActivityDto,
  QualifyingDto,
  qualificationDto,
} from "../dto";
import * as sql from "mssql";


@Injectable()
export class ActivityHelperSeervice{
  constructor(
    private dbController: SqlService,
    private readonly toolbox: Tools,
  ){}

  @HandleErrors()
  async isActivityAvailable(
    classroomListId: number,
    unitNumber: number,
    activityQualification: number): Promise<boolean>{
      const params = this.toolbox.jsonToSqlParams({
	clist: classroomListId,
	u_number: unitNumber,
      });
      const DBResult = await this.dbController.executeProcedure('sp_get_total_points', params);
      if(DBResult.length === 0){
	throw new CustomHttpException(
	  ErrorCodeMap.activity.activityUnavailable,
	  '',
	  'Activity cant be evaluated because classroom list dont exist',
	  HttpStatus.CONFLICT
	);
      }
      const currentPoints: number = DBResult?.[0]?.currentQualification;
      if(currentPoints + activityQualification > 100){
	return false;
      }
      return true;
  }

  mapperCreateActivityParams(newActivity: requestCreateActivityDto): sql.SqlParameter[]{
    return this.toolbox.jsonToSqlParams({
      a_declarativeName: newActivity.declarative.name,
      a_proceduralName: newActivity.procedural.name,
      a_attitudinalName: newActivity.attitudinal.name,
      a_declarativeQualification: newActivity.declarative.qualification,
      a_proceduralQualification: newActivity.procedural.qualification,
      a_attitudinalQualification: newActivity.attitudinal.qualification,
      ClistId: newActivity.activity.classroomListId,
      subTypeId: newActivity.activity.subTypeId,
      unit_number: newActivity.activity.unitNumber,
    });
  }

  isValidAllQualification(toQualify: requestQualficateActivityDto): boolean{
    const {declarative, attitudinal, procedural, qualfication} = toQualify;
    const isDeclarativeValid = this.isQualificationValid(declarative, qualfication);
    const isAttitudinalValid = this.isQualificationValid(attitudinal, qualfication);
    const isProceduralValid = this.isQualificationValid(procedural, qualfication);
    if(!isDeclarativeValid || !isAttitudinalValid || !isProceduralValid){
      return false
    }
    return true;
  }

  private isQualificationValid(qualification: QualifyingDto, activityInfo: qualificationDto): boolean{ 
    const {studentQualification, studentCurrentQualification, activityQualification} = qualification;
    const totalToQualify = studentQualification + studentCurrentQualification;
    if(totalToQualify > activityQualification && activityInfo.typeId === 1){
      return false;
    }
    if(totalToQualify < activityQualification && activityInfo.typeId === 2){
      return false;
    }
    return true;
  }

}
