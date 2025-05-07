import { Injectable, HttpStatus } from "@nestjs/common";
import { SqlService } from "src/common/database/sql.service";
import { Tools } from "src/common/utils/tools.util";
import { ErrorCodeMap, successMessages } from "src/common/constants";
import { CustomHttpException } from "src/common/exceptions/custom-http.exception";
import { GenericResponseDto } from "src/common/dto/generic_response.dto";
import { plainToInstance } from "class-transformer";
import { HandleErrors } from "src/common/decorators/handle-errors.decorator";
import { requestCreateClassroomDto, newCreatedClassroomDto, requestListToClassroomDto } from "./dto";


@Injectable()
export class ClassroomService{
  constructor(
    private dbController: SqlService,
    private readonly toolbox: Tools,
  ){}

  @HandleErrors()
  async createClassroom(newClassroom: requestCreateClassroomDto): Promise<GenericResponseDto>{
    const response = new GenericResponseDto<newCreatedClassroomDto>();
    const params = this.toolbox.jsonToSqlParams(newClassroom);
    const DBResult = await this.dbController.executeProcedure('sp_create_classroom', params);
    if(DBResult.length === 0){
      throw new CustomHttpException(ErrorCodeMap.classroom.classroomCantCreated, '', 'Classroom dont returned created data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const classroom: newCreatedClassroomDto[] = plainToInstance(newCreatedClassroomDto, DBResult);
    response.message = successMessages.created.replace('@data', 'classroom');
    response.result = classroom;
    return response;
  }

  @HandleErrors()
  async importListIntoClassroom(importedList: requestListToClassroomDto): Promise<GenericResponseDto>{
    const response = new GenericResponseDto();
    const params = this.toolbox.jsonToSqlParams(importedList);
    const DBResult = await this.dbController.executeProcedure('sp_list_2_classroom', params);
    if(DBResult.length === 0){
      throw new CustomHttpException(
	ErrorCodeMap.classroom.classroomCantImported,
	'',
	'List cant imported to classroom database dont returned nothing',
	HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const result = DBResult?.[0]?.result;
    if(result !== 0){
      throw new CustomHttpException(
	ErrorCodeMap.classroom.classroomAlreadyAdded,
	'',
	'List already added to classroom',
	HttpStatus.CONFLICT
      );
    }
    response.message = successMessages.created.replace('@data', 'list to classroom');
    return response;
  }

}
