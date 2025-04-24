import { Injectable,HttpStatus } from "@nestjs/common";
import { SqlService } from "src/common/database/sql.service";
import { Tools } from "src/common/utils/tools.util";
import * as sql from "mssql";
import {ErrorCodeMap} from "src/common/constants";
import { CustomHttpException } from "src/common/exceptions/custom-http.exception";

@Injectable()
export class StudentService{
  constructor(
    private dbController: SqlService,
    private readonly toolbox: Tools,
  ){}
}

