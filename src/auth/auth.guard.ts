import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CustomHttpException } from 'src/common/exceptions/custom-http.exception';
import { SqlService } from 'src/common/database/sql.service';
import { Tools } from 'src/common/utils/tools.util';
import { ConfigService } from '@nestjs/config';
import { ErrorCodeMap } from 'src/common/constants';
import * as sql from 'mssql';
import { EncryptionUtil } from 'src/common/utils/encryption.util';
import { TokenExpiredError } from '@nestjs/jwt';
import { HandleErrors } from 'src/common/decorators/handle-errors.decorator';



@Injectable()
export class AuthGuard implements CanActivate{

  constructor(
    private JwtService: JwtService,
    private dbController: SqlService,
    private toolbox: Tools,
    private config: ConfigService,
    private encryptionUtil: EncryptionUtil,
  ){}


  @HandleErrors()
  async canActivate(context: ExecutionContext): Promise<boolean>{

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if(!token){
      throw new CustomHttpException(ErrorCodeMap.auth.invalidSession, '', 'Invalid session', HttpStatus.UNAUTHORIZED);
    }

    const payload = await this.JwtService.verifyAsync(token, {secret: this.config.get<string>('SECRET_KEY') || ''});
    const params = this.toolbox.jsonToSqlParams({
      document_number: payload?.document_number,
      sessionID: payload?.session_id,
    });

    const DBResult = await this.dbController.executeProcedure('sp_get_teacher_token', params);

    if(DBResult.length === 0){
      throw new CustomHttpException(ErrorCodeMap.auth.invalidSession, '', 'Invalid session', HttpStatus.UNAUTHORIZED);
    }

    const DBPassword = DBResult?.[0]?.password || '';
    const passwordMatch = await this.encryptionUtil.comparePassword(DBPassword, payload?.public_password);

    if(!passwordMatch){
      throw new CustomHttpException(ErrorCodeMap.auth.invalidSession, '', 'Invalid session', HttpStatus.UNAUTHORIZED);
    }

    return true;
 
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token ]= request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

}
