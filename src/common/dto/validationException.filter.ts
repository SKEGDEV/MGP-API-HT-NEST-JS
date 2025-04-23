import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';
import { Tools } from '../utils/tools.util'; 


const ValidationErrorCodeMap = {
  isNotEmpty: 'USR_001',
  isString: 'USR_002',
  isBoolean: 'USR_002',
  isInt: 'USR_002',
  isDate: 'USR_002',
  isEmail: 'USR_002',
  minLength: 'USR_004',
  maxLength: 'USR_003',
  unknown: 'USR_000',
}

function detectValidationType(message: string): string {
    if (message.includes('must be an email')) return 'isEmail';
    if (message.includes('should not be empty')) return 'isNotEmpty';
    if (message.includes('must be a string')) return 'isString';
    if (message.includes('must be a Date')) return 'isDate';
    if (message.includes('must be longer than')) return 'minLength';
    if (message.includes('must be shorter than')) return 'maxLength';
    return 'unknown';
}

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter{
  private toolbox: Tools = new Tools();
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const responseBody = exception.getResponse();
    const validationErrors = (responseBody as any).message;

    if(Array.isArray(validationErrors)){
      const rawMessage = validationErrors[0] || '';
      const field = rawMessage.split(' ')[0] || 'unknown';
      const errorKey = detectValidationType(rawMessage);
      const code = ValidationErrorCodeMap[errorKey] || 'USR_000';

      const error = this.toolbox.makeErrorResponse(
	status,
	{code: code, type: 'validation'},
	field,
	rawMessage,
      );

      response.status(status).json(error);

    }else{
      response.status(status).json(responseBody);
    }
  }

}
