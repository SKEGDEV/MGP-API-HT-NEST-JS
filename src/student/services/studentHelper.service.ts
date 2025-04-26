import {Injectable, HttpStatus} from "@nestjs/common";
import { SqlService } from "src/common/database/sql.service";
import { Tools } from "src/common/utils/tools.util";
import * as sql from "mssql";
import {ErrorCodeMap} from "src/common/constants";
import { CustomHttpException } from "src/common/exceptions/custom-http.exception";
import { GenericResponseDto } from "src/common/dto/generic_response.dto";
import {StudentDto} from '../dto'

@Injectable()
export class StudentHelperService{
  constructor(
    private dbController: SqlService,
    private readonly toolbox: Tools,
  ){}

  async registerStudents(students: StudentDto[]): Promise<void>{
    try{
      const table = new sql.Table();
      table.columns.add('student_firstName', sql.VarChar(200), { nullable: false });
      table.columns.add('student_lastName', sql.VarChar(200), { nullable: false });
      table.columns.add('student_code', sql.VarChar(50), { nullable: false });
      table.columns.add('student_listId', sql.Int, { nullable: false });
      table.columns.add('student_statusId', sql.Int, { nullable: false });
      table.columns.add('student_birthday', sql.Date, { nullable: true });
      table.columns.add('student_motherNumber', sql.VarChar(50), { nullable: true });
      table.columns.add('student_fatherNumber', sql.VarChar(50), { nullable: true });
      table.columns.add('student_phoneNumber', sql.VarChar(50), { nullable: true });

      students.forEach(s =>{
	table.rows.add(	
	  s.student_firstName,
	  s.student_lastName,
	  s.student_code,
	  s.student_listId,
	  s.student_statusId,
	  s.student_birthday,
	  s.student_motherNumber,
	  s.student_fatherNumber,
	  s.student_phoneNumber
	);
      });
      const request = new sql.Request();
      request.input('students', table);
      await request.execute('sp_bulk_insert_students');
    }catch(e){
      if(e instanceof sql.RequestError || e instanceof sql.ConnectionError){
	throw new CustomHttpException(ErrorCodeMap.auth.internalError, '',  `Database error: ${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      if(e instanceof CustomHttpException){
	throw e;
      }
      throw new CustomHttpException(ErrorCodeMap.auth.internalError, '',  `Unknown error: ${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}

