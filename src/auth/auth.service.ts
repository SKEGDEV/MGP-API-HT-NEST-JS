import { Injectable } from "@nestjs/common";
import {SqlService} from "../common/database/sql.service";
import {EncryptionUtil} from "../common/utils/encryption.util";
import {Tools} from "../common/utils/tools.util";
import {CreateAccountRequestDto, SessionResponseDto} from "./dto/create_account.dto";
import {LoginRequestDto} from "./dto/login.dto";
import * as sql from "mssql";
import { AuthHelperService } from "./services/authHelper.service";
import {ErrorCodeMap} from "../common/constants";
import { successMessages } from "../common/constants";


@Injectable()
export class AuthService{
  constructor(
    private dbController: SqlService,
    private authUtilityService: AuthHelperService,
    private readonly encryptionUtil: EncryptionUtil,
    private readonly toolbox: Tools,
  ) {}

  async createAccount(new_user: CreateAccountRequestDto): Promise<SessionResponseDto>{
    let response = new SessionResponseDto();
    try{
      const userExists = await this.authUtilityService.userExists(new_user.document_number, new_user.document_type);
      if(userExists){ 
	return{
	  ...response,
	  error : this.toolbox.makeErrorResponse(409, ErrorCodeMap.auth.duplicated, new_user.document_number, 'User duplicated')
	}
      } 
      const userEntity = {
	...new_user,
	password: await this.encryptionUtil.hashPassword(new_user.password)
      }
      const params = this.toolbox.jsonToSqlParams(userEntity);
      const publicPassword = this.authUtilityService.generatePublicPassword(10);
      const resultCreateAccount = await this.dbController.executeProcedure('sp_create_account', params)
      const teacher_id = resultCreateAccount?.[0]?.id || 0;
      const data = {
	document_number: new_user.document_number,
	public_password: publicPassword,
	type_session: 1,
	teacher_id: teacher_id,
      }
      response = await this.authUtilityService.createJWT(data);
    }catch(e){
      if(e instanceof sql.RequestError || e instanceof sql.ConnectionError){
	return {
	  ...response,
	  error: this.toolbox.makeErrorResponse(500, ErrorCodeMap.auth.internalError, '', `Database error: ${e.message}`)
	};
      }
      response.error = this.toolbox.makeErrorResponse(500, ErrorCodeMap.auth.internalError, '', `Unknown error: ${e.message}`);
    } 
    return response;
  }

  async login(login_form: LoginRequestDto): Promise<SessionResponseDto>{
    let response = new SessionResponseDto();
    try{
      const public_password =  this.authUtilityService.generatePublicPassword(10);
      const params = this.toolbox.jsonToSqlParams({
	document_number: login_form.document_number,
	document_type: login_form.document_type,
      });
      const DBResult = await this.dbController.executeProcedure('sp_get_teacher_session', params)
      if(DBResult.length === 0){
	return{
	  ...response,
	  error: this.toolbox.makeErrorResponse(401, ErrorCodeMap.auth.invalid, '', 'Invalid credentials')
	}
      }
      const DBPassword = DBResult?.[0]?.teacher_sessionPassword || '';
      const isPasswordCorrect = await this.encryptionUtil.comparePassword(login_form.password, DBPassword) 
      if(!isPasswordCorrect){
	return{
	  ...response,
	  error: this.toolbox.makeErrorResponse(401, ErrorCodeMap.auth.invalid, '', 'Invalid credentials')
	}
      }
      const data = {
	document_number: login_form.document_number,
	public_password: public_password,
	type_session: 2,
	teacher_id: 0,
      }
      response = await this.authUtilityService.createJWT(data);
    }catch(e){
      if(e instanceof sql.RequestError || e instanceof sql.ConnectionError){
	return {
	  ...response,
	  error:this.toolbox.makeErrorResponse(500, ErrorCodeMap.auth.internalError, '', `Database error: ${e.message}`)
	}
      }
      response.error = this.toolbox.makeErrorResponse(500, ErrorCodeMap.auth.internalError, '', `Unknown error: ${e.message}`);
    }
    return response;
  }

  async logout(document_number: string): Promise<SessionResponseDto>{
    let response = new SessionResponseDto();
    try{
      const data = {
	document_number: document_number,
	public_password: '',
	type_session: 3,
	teacher_id: 0,
      }
      const params = this.toolbox.jsonToSqlParams(data);
      const DBResult = await this.dbController.executeProcedure('sp_update_teacher_session', params);
      if(DBResult.length === 0){
	return{
	  ...response,
	  error: this.toolbox.makeErrorResponse(401, ErrorCodeMap.auth.logoutError, '', 'Invalid document number')
	}
      }
      response.message = successMessages.logout.replace('@name', DBResult?.[0]?.name || '');
    }catch(e){
      if(e instanceof sql.RequestError || e instanceof sql.ConnectionError){
	return {
	  ...response,
	  error:this.toolbox.makeErrorResponse(500, ErrorCodeMap.auth.internalError, '', `Database error: ${e.message}`)
	}
      }
      response.error = this.toolbox.makeErrorResponse(500, ErrorCodeMap.auth.internalError, '', `Unknown error: ${e.message}`);
    }
    return response;
  }

}
