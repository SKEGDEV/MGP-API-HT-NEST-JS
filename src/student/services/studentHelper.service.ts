import {Injectable, HttpStatus} from "@nestjs/common";
import { SqlService } from "src/common/database/sql.service";
import { Tools } from "src/common/utils/tools.util";
import * as sql from "mssql";
import {ErrorCodeMap} from "src/common/constants";
import { CustomHttpException } from "src/common/exceptions/custom-http.exception";
import { GenericResponseDto } from "src/common/dto/generic_response.dto";
import {StudentDto} from '../dto'
import { HandleErrors } from "src/common/decorators/handle-errors.decorator";

@Injectable()
export class StudentHelperService{
  constructor(
    private dbController: SqlService,
    private readonly toolbox: Tools,
  ){}

  @HandleErrors()
  async registerStudents(students: StudentDto[]): Promise<void>{
    const columns = [
      { name: 'student_firstName', type: sql.VarChar(200), nullable: false },
      { name: 'student_lastName', type: sql.VarChar(200), nullable: false },
      { name: 'student_code', type: sql.VarChar(50), nullable: false },
      { name: 'student_listId', type: sql.Int, nullable: false },
      { name: 'student_statusId', type: sql.Int, nullable: false },
      { name: 'student_birthday', type: sql.Date, nullable: true },
      { name: 'student_motherNumber', type: sql.VarChar(50), nullable: true },
      { name: 'student_fatherNumber', type: sql.VarChar(50), nullable: true },
      { name: 'student_phoneNumber', type: sql.VarChar(50), nullable: true },
    ];

    const table = this.toolbox.arrayToSqlTable(students, columns);
    await this.dbController.executeProcedureWithTVP('sp_bulk_insert_students', 'students', table);
  }

}

