import * as sql from 'mssql';
import { ErrorDto } from '../dto/error.dto';
import { ErrorDictionaries } from '../constants';
import {Injectable} from '@nestjs/common';


export interface ErrorParameter{
  code: string;
  type: string;
}

@Injectable()
export class Tools{

  jsonToSqlParams(json: Record<string, any>): sql.SqlParameter[]{
    return Object.entries(json).map(([key, value])=>{
      let typeValue;

      switch(typeof value){
	case 'string':
	  typeValue = sql.NVarChar;
	break;
	case 'number':
	  typeValue = Number.isInteger(value) ? sql.Int : sql.Float; 
	break;
	case 'boolean':
	  typeValue = sql.Bit;
	break;
	case 'object':
	  if(value instanceof Date){
	    typeValue = sql.DateTime;
	  }else{
	    typeValue = sql.NVarChar;
	  }
	break;
	default:
	  typeValue = sql.NVarChar;
      }

      return{
	name: key,
	type: typeValue,
	value: value
      }
    });
  }

   makeErrorResponse(
     statusCode: number,
     errorMap: ErrorParameter,
     data: string,
     details: string ): ErrorDto{
       const error = new ErrorDto();
       const dictionary = ErrorDictionaries?.[errorMap.type];
       error.success = false;
       error.statusCode = statusCode;
       error.message = dictionary?.[errorMap.code].replace('@data', data) || 'Unexpected error'; 
       error.errorCode = errorMap.code;
       error.errorDetails = details;
       return error;
     }

}

