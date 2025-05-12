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

@Injectable()
export class ActivityService{
  constructor(
    private dbController: SqlService,
    private readonly toolbox: Tools,
  ){}
  
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
}
