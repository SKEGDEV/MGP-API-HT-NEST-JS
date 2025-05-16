import { Injectable, HttpStatus } from "@nestjs/common";
import { SqlService } from "src/common/database/sql.service";
import { Tools } from "src/common/utils/tools.util";
import { ErrorCodeMap, successMessages } from "src/common/constants";
import { CustomHttpException } from "src/common/exceptions/custom-http.exception";
import { GenericResponseDto } from "src/common/dto/generic_response.dto";
import { plainToInstance } from "class-transformer";
import { HandleErrors } from "src/common/decorators/handle-errors.decorator";
import { 
  requestCreateClassroomDto,
  newCreatedClassroomDto,
  requestListToClassroomDto,
  responseClassroomDto,
  responseClassroomYearDto,
  responseClassroomStudentDto,
  responseClassroomListDto,
} from "./dto";


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

  @HandleErrors()
  async getAllClassroom(
    documentId:string,
    year:number,
    variant:number): Promise<GenericResponseDto>{
    const params = this.toolbox.jsonToSqlParams({
      document_number: documentId,
      in_year: year,
      variant: variant,
    });
    const DBResult = await this.dbController.executeProcedure('sp_get_all_classroom', params);
    if(DBResult.length === 0){
      const response = new GenericResponseDto();
      response.message = successMessages.empty.replace('@data', variant === 1? 'classroom':'classroom year');
      return response;
    }
    if(variant === 1){
      const response = new GenericResponseDto<responseClassroomDto>();
      response.result = plainToInstance(responseClassroomDto, DBResult);
      response.message = successMessages.finded.replace('@data', 'classroom');
      return response;
    }
    const response = new GenericResponseDto<responseClassroomYearDto>();
    response.result = plainToInstance(responseClassroomYearDto, DBResult);
    response.message = successMessages.finded.replace('@data', 'classroom year');
    return response;
  }

  @HandleErrors()
  async getAllClassroomStudent(
    classroomId: number,
    unitNumber: number,
    documentId: string): Promise<GenericResponseDto>{
    const response = new GenericResponseDto<responseClassroomStudentDto>();
    const params = this.toolbox.jsonToSqlParams({
      Clist_id: classroomId,
      unitNumber: unitNumber,
      document_number: documentId,
    });
    const DBResult = await this.dbController.executeProcedure('sp_get_classroom_student', params);
    if(DBResult.length === 0){
      response.message = successMessages.empty.replace('@data', 'classroom students');
      return response;
    }
    response.result = plainToInstance(responseClassroomStudentDto, DBResult);
    response.message = successMessages.finded.replace('@data', 'classroom students');
    return response;
  }

  @HandleErrors()
  async getAllClassroomList(
    classroomId: number,
    documentId:string
  ): Promise<GenericResponseDto>{
    const response = new GenericResponseDto<responseClassroomListDto>();
    const params = this.toolbox.jsonToSqlParams({
      classroom_id: classroomId,
      document_number: documentId,
    });
    const DBResult = await this.dbController.executeProcedure('sp_get_clist', params);
    if(DBResult.length === 0){
      response.message = successMessages.empty.replace('@data', 'classroom list');
      return response;
    }
    response.result = plainToInstance(responseClassroomListDto, DBResult);
    response.message = successMessages.finded.replace('@data', 'classroom list');
    return response;
  }

  @HandleErrors()
  async getClassroomCatalog(classroomListId: number, documentId: string): Promise<GenericResponseDto>{
    const response = new GenericResponseDto<responseClassroomListDto>();
    const params = this.toolbox.jsonToSqlParams({
      classroom_list_id: classroomListId,
      document_number: documentId,
    });
    const DBResult = await this.dbController.executeProcedure('get_catalog_classroom', params);
    if(DBResult.length === 0){
      response.message = successMessages.empty.replace('@data', 'classroom list catalog');
      return response;
    }
    response.result = plainToInstance(responseClassroomListDto, DBResult);
    response.message = successMessages.finded.replace('@data', 'classroom list catalog')
    return response;
  }

}
