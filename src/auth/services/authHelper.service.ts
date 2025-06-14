import {Injectable, HttpStatus} from '@nestjs/common';
import { SqlService } from 'src/common/database/sql.service';
import * as crypto from 'crypto';
import { Tools } from 'src/common/utils/tools.util';
import { SessionResponseDto } from '../dto';
import { JwtService } from '@nestjs/jwt';
import { ErrorCodeMap, successMessages } from 'src/common/constants';
import { EncryptionUtil } from 'src/common/utils/encryption.util';
import { CustomHttpException } from 'src/common/exceptions/custom-http.exception';
import { HandleErrors } from 'src/common/decorators/handle-errors.decorator';

interface JWTData{
  document_number: string;
  public_password: string;
  type_session: number; 
  teacher_id: number;
}

@Injectable()
export class AuthHelperService{
  constructor(
    private dbController: SqlService,
    private jwtHelper: JwtService,
    private readonly toolbox: Tools,
    private readonly encryptionUtil: EncryptionUtil,
  ) {}

  generatePublicPassword(length: number): string{
    const alphabet: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?/';
    let password: string = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, alphabet.length);
      password += alphabet[randomIndex];
    }

    return password;
  }

  @HandleErrors()
  async userExists(document_number: string, document_type: number): Promise<boolean>{
    let result: boolean = false;

    const params = this.toolbox.jsonToSqlParams({
      document_number: document_number,
      document_type: document_type
    });

    const DBResult = await this.dbController.executeProcedure('sp_get_teacher_session', params);

    if(DBResult.length === 0){
      result = false;
    }else{
      result = true;
    }

    return result;
  }

  @HandleErrors()
  async createJWT(data: JWTData): Promise<SessionResponseDto>{ 
    const response = new SessionResponseDto();

    const params = this.toolbox.jsonToSqlParams(data);
    const dbResult = await this.dbController.executeProcedure('sp_update_teacher_session', params);
    if(dbResult.length === 0){
      throw new CustomHttpException(ErrorCodeMap.auth.sessionError, '', 'Database error: Session not found', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const encriptedPublicPassword = await this.encryptionUtil.hashPassword(data.public_password);
    const tokenPayload = {
      document_number: dbResult?.[0]?.document,
      session_id: dbResult?.[0]?.session_uid,
      public_password: encriptedPublicPassword,
    }
    const Token = await this.jwtHelper.signAsync(tokenPayload)
    response.token = Token;
    response.name = dbResult?.[0]?.name || '';
    response.document_number = dbResult?.[0]?.document || '';
    response.message = data.type_session === 1 ?
      successMessages.createdUser.replace('@name', response.name) :
      successMessages.login.replace('@name', response.name);
 
    return response;
  }

}
