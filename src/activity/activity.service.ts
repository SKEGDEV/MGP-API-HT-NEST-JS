import { Injectable, HttpStatus } from "@nestjs/common";
import { SqlService } from "src/common/database/sql.service";
import { Tools } from "src/common/utils/tools.util";
import { HandleErrors } from "src/common/decorators/handle-errors.decorator";
import { CustomHttpException } from "src/common/exceptions/custom-http.exception";
import { ErrorCodeMap, successMessages } from "src/common/constants";
import { GenericResponseDto } from "src/common/dto/generic_response.dto";
import {
  requestQualficateActivityDto,
  requestCreateActivityDto,
  responseGetAllActivityDto,
  responseGetActivityStudentDto,
  responseStudentToQualifyDto,
} from "./dto";
import { plainToInstance } from "class-transformer";
import { ActivityHelperSeervice } from "./service/activityHelper.service";

@Injectable()
export class ActivityService{
  constructor(
    private dbController: SqlService,
    private readonly toolbox: Tools,
    private helperService: ActivityHelperSeervice,
  ){}

  @HandleErrors()
  async createActivity(newActivity: requestCreateActivityDto): Promise<GenericResponseDto>{
    const response = new GenericResponseDto();
    const {declarative, attitudinal, procedural, activity} = newActivity;
    const qualificationTotal = declarative.qualification + attitudinal.qualification + procedural.qualification;
    const isQualificationValid = await this.helperService.isActivityAvailable(activity.classroomListId, activity.unitNumber, qualificationTotal);
    if(!isQualificationValid){
      throw new CustomHttpException(
	ErrorCodeMap.activity.activityExcededQualification,
	'',
	'Activity has evaluated but exceeded the qualification',
	HttpStatus.CONFLICT
      );
    }
    const params = this.helperService.mapperCreateActivityParams(newActivity);
    await this.dbController.executeProcedure('sp_create_activity', params);
    response.message = successMessages.created.replace('@data', 'activity');
    return response;
  }
  
  @HandleErrors()
  async getAllActivity(
    classroomListId: number,
    unitNumber: number,
    documentNumber: string): Promise<GenericResponseDto>{
    const response = new GenericResponseDto<responseGetAllActivityDto>();
    const params = this.toolbox.jsonToSqlParams({
      clist_id: classroomListId,
      unit_number: unitNumber,
      document_number: documentNumber,
    });
    const DBResponse = await this.dbController.executeProcedure('sp_get_all_activity', params);
    if(DBResponse.length === 0){
      response.message = successMessages.empty.replace('@data', 'activity');
      return response;
    }
    response.result = plainToInstance(responseGetAllActivityDto, DBResponse);
    response.message = successMessages.finded.replace('@data', 'activity');
    return response;
  }

  @HandleErrors()
  async getAllStudentActivity(
    activityId: number,
    documentNumber: string
  ): Promise<GenericResponseDto>{
    const response = new GenericResponseDto<responseGetActivityStudentDto>();
    const params = this.toolbox.jsonToSqlParams({
      activity_id: activityId,
      document_number: documentNumber,
    });
    const DBResponse = await this.dbController.executeProcedure('sp_get_activity_student', params);
    if(DBResponse.length === 0){
      response.message = successMessages.empty.replace('@data', 'activity student list');
      return response;
    }
    response.result = plainToInstance(responseGetActivityStudentDto, DBResponse);
    response.message = successMessages.finded.replace('@data', 'activity student list');
    return response;
  }

  @HandleErrors()
  async getStudentToQualify(
    studentActivityId: number,
    documentNumber: string
  ): Promise<GenericResponseDto>{
    const response = new GenericResponseDto<responseStudentToQualifyDto>();
    const params = this.toolbox.jsonToSqlParams({
      student_id: studentActivityId,
      document_number: documentNumber,
    });
    const DBResponse = await this.dbController.executeProcedure('sp_get_student2qualified', params);
    if(DBResponse.length === 0){
      throw new CustomHttpException(
	ErrorCodeMap.activity.activityStudentNotExists,
	'',
	'Student dont finded on activity register',
	HttpStatus.CONFLICT
      );
    }
    response.result = plainToInstance(responseStudentToQualifyDto, DBResponse);
    response.message = successMessages.finded.replace('@data', 'student to qualify');
    return response;
  }

  @HandleErrors()
  async qualifyActivity(
    qualifyActivity: requestQualficateActivityDto
  ): Promise<GenericResponseDto>{
    const response = new GenericResponseDto();
    const isRequestValid = this.helperService.isValidAllQualification(qualifyActivity);
    if(!isRequestValid){
      throw new CustomHttpException(
	ErrorCodeMap.activity.activityInvalidQualification,
	'',
	'Qualification request has invalid points to add or remove',
	HttpStatus.CONFLICT
      );
    }
    const params = this.toolbox.jsonToSqlParams({
      s_id: qualifyActivity.qualfication.activityStudentId,
      a_declarativeQualification: qualifyActivity.declarative.studentQualification,
      a_attitudinalQualification: qualifyActivity.attitudinal.studentQualification,
      a_proceduralQualification: qualifyActivity.procedural.studentQualification,
    });
    await this.dbController.executeProcedure('sp_update_activity', params);
    response.message = successMessages.updated.replace('@data', 'qualify activity');
    return response;
  }

}
