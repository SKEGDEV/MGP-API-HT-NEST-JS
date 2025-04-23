import {Injectable} from '@nestjs/common';
import { SqlService } from 'src/common/database/sql.service';
import * as crypto from 'crypto';
import * as sql from 'mssql';
import { Tools } from 'src/common/utils/tools.util';
import { SessionResponseDto } from '../dto/create_account.dto';
import { JwtService } from '@nestjs/jwt';
import { ErrorCodeMap } from 'src/common/constants';
import { successMessages } from 'src/common/constants';
import { EncryptionUtil } from 'src/common/utils/encryption.util';

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

  async userExists(document_number: string, document_type: number): Promise<boolean>{
    let result: boolean = false;
    try{
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

    }catch(e){
      throw e;
    }
    return result;
  }

  async createJWT(data: JWTData): Promise<SessionResponseDto>{ 
    const response = new SessionResponseDto();
    try{
      const params = this.toolbox.jsonToSqlParams(data);
      const dbResult = await this.dbController.executeProcedure('sp_update_teacher_session', params);
      if(dbResult.length === 0){
	return{
	  ...response,
	  error: this.toolbox.makeErrorResponse(500, ErrorCodeMap.auth.sessionError, '', 'Database error: Session not found')
	}
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
    }catch(e){
      if(e instanceof sql.RequestError || e instanceof sql.ConnectionError){
	return{
	  ...response,
	  error: this.toolbox.makeErrorResponse(500, ErrorCodeMap.auth.internalError, '', `Database error: ${e.message}`)
	}
      }
      response.error = this.toolbox.makeErrorResponse(500, ErrorCodeMap.auth.internalError, '', `Unknown error: ${e.message}`);
    } 
    return response;
  }

}
