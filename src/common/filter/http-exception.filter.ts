import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";
import { Tools } from "../utils/tools.util";
import { CustomHttpException } from "../exceptions/custom-http.exception";
import { ErrorCodeMap } from "../constants";
import { ErrorParameter } from "../utils/tools.util";

@Catch()
export class AllExceptionsHttpFilter implements ExceptionFilter{
  private readonly toolbox: Tools = new Tools();

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status_code: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMap: ErrorParameter = ErrorCodeMap.default.unknown
    let details: string = '';
    let data: string = '';

    if(exception instanceof CustomHttpException){
      status_code = exception.getStatus();
      errorMap = exception?.errorMap;
      details = exception?.details;
      data = exception?.data;
    }else if(exception instanceof HttpException){
      status_code = exception.getStatus();
      errorMap = ErrorCodeMap.default.httpException;
      details = 'Unexpected Http error';
      const responseData = exception.getResponse();
      if(typeof responseData === 'object' && responseData !== null){
	const errObj = responseData as any;
	data = errObj?.message || 'Unknown error';
      }else{
	data = responseData as string;
      }
    }else if(exception instanceof Error){
      data = exception.message;
    }
    const errorResponse = this.toolbox.makeErrorResponse(status_code, errorMap, data, details);

    response.status(status_code).json(errorResponse);
  }

}
