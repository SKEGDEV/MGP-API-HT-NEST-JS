import { Injectable,HttpStatus } from "@nestjs/common";
import { SqlService } from "src/common/database/sql.service";
import { Tools } from "src/common/utils/tools.util";
import * as sql from "mssql";
import {ErrorCodeMap} from "src/common/constants";
import { CustomHttpException } from "src/common/exceptions/custom-http.exception";
import { CreateListRequestDto, ListDto, StudentDto, Student2UpdateDto } from "./dto";
import { GenericResponseDto } from "src/common/dto/generic_response.dto";
import { StudentHelperService } from "./services/studentHelper.service";
import { successMessages } from "src/common/constants";
import {plainToInstance} from "class-transformer";


@Injectable()
export class StudentService{
  constructor(
    private dbController: SqlService,
    private readonly toolbox: Tools,
    private readonly studentHelperService: StudentHelperService,
  ){}

  async createStudentList(new_list: CreateListRequestDto): Promise<GenericResponseDto>{
    const response = new GenericResponseDto();
    try{
      // separate the list data without students, thats for separate the data for two different procedures
      const {students, ...new_listData} = new_list;
      const params = this.toolbox.jsonToSqlParams(new_listData);
      const DBResult = await this.dbController.executeProcedure('sp_create_class_list', params);
      if(DBResult.length === 0){
	throw new CustomHttpException(ErrorCodeMap.student.studentListCantCreated, '', 'Student list could not registred on data base', HttpStatus.UNPROCESSABLE_ENTITY)
      }
      const list_id = DBResult?.[0]?.id;
      const studentsData = students.map((student) => ({
	...student,
	student_listId: list_id,
	student_statusId: 1,
      }));
      await this.studentHelperService.registerStudents(studentsData);
      response.message = successMessages.created.replace('@data', 'student list'); 
    }catch (e){
      if(e instanceof sql.RequestError || e instanceof sql.ConnectionError){
	throw new CustomHttpException(ErrorCodeMap.auth.internalError, '',  `Database error: ${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      if(e instanceof CustomHttpException){
	throw e;
      }
      throw new CustomHttpException(ErrorCodeMap.auth.internalError, '',  `Unknown error: ${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return response;
  }

  async getAllTeachersList(document_number:string): Promise<GenericResponseDto>{
    const response = new GenericResponseDto<ListDto>();
    try{
      const params = this.toolbox.jsonToSqlParams({
	document: document_number
      });
      const DBResult = await this.dbController.executeProcedure('sp_get_all_list', params);
      if(DBResult.length === 0){
	response.message = successMessages.empty.replace('@data', 'teachers list');
	return response;
      }
      const list: ListDto[] = plainToInstance(ListDto, DBResult);
      response.result = list;
      response.message = successMessages.finded.replace('@data', 'teachers list');
    }catch (e){
      if(e instanceof sql.RequestError || e instanceof sql.ConnectionError){
	throw new CustomHttpException(ErrorCodeMap.auth.internalError, '',  `Database error: ${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      throw new CustomHttpException(ErrorCodeMap.auth.internalError, '',  `Unknown error: ${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return response;
  }

  async getStudentList(list_id: number, document_number: string): Promise<GenericResponseDto>{
    const response = new GenericResponseDto<StudentDto>();
    try{
      const params = this.toolbox.jsonToSqlParams({
	list_id: list_id,
	document_id: document_number,
      });
      const DBResult = await this.dbController.executeProcedure('sp_getstudent_list', params);
      if(DBResult.length === 0){
	response.message = successMessages.empty.replace('@data', 'student list');
	return response;
      }
      const list: StudentDto[] = plainToInstance(StudentDto, DBResult);
      response.result = list;
      response.message = successMessages.finded.replace('@data', 'student list');
    }catch (e){
      if(e instanceof sql.RequestError || e instanceof sql.ConnectionError){
	throw new CustomHttpException(ErrorCodeMap.auth.internalError, '',  `Database error: ${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      throw new CustomHttpException(ErrorCodeMap.auth.internalError, '',  `Unknown error: ${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return response;
  }

  async createStudentOutList(new_student: StudentDto): Promise<GenericResponseDto>{
    const response = new GenericResponseDto();
    try{
      // Procedure dont admit student_statusId, so we need to separate it
      const {student_statusId, ...studentData} = new_student;
      const params = this.toolbox.jsonToSqlParams(studentData);
      await this.dbController.executeProcedure('sp_add_student_out_list', params);
      response.message = successMessages.created.replace('@data', 'student out list');
    }catch (e){
      if(e instanceof sql.RequestError || e instanceof sql.ConnectionError){
	throw new CustomHttpException(ErrorCodeMap.auth.internalError, '',  `Database error: ${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      throw new CustomHttpException(ErrorCodeMap.auth.internalError, '',  `Unknown error: ${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return response;
  }

  async getStudent2Update(studentID: number, document_number: string): Promise<GenericResponseDto>{
    const response = new GenericResponseDto();
    try{
      const params = this.toolbox.jsonToSqlParams({
	s_id: studentID,
	document_id: document_number,
      });
      const DBResult = await this.dbController.executeProcedure('sp_get_student2update', params);
      if(DBResult.length === 0){
	response.message = successMessages.empty.replace('@data', 'student');
	return response;
      }
      const student: Student2UpdateDto[] = plainToInstance(Student2UpdateDto, DBResult);
      response.result = student;
      response.message = successMessages.finded.replace('@data', 'student');
    }catch (e){
      if(e instanceof sql.RequestError || e instanceof sql.ConnectionError){
	throw new CustomHttpException(ErrorCodeMap.auth.internalError, '',  `Database error: ${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      throw new CustomHttpException(ErrorCodeMap.auth.internalError, '',  `Unknown error: ${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return response;
  }

}

