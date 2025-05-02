import { Injectable, HttpStatus } from "@nestjs/common";
import {SqlService} from "../common/database/sql.service";
import {EncryptionUtil} from "../common/utils/encryption.util";
import {Tools} from "../common/utils/tools.util";
import {CreateAccountRequestDto, SessionResponseDto, LoginRequestDto} from "./dto";
import { AuthHelperService } from "./services/authHelper.service";
import { successMessages, sessionTypes, ErrorCodeMap } from "../common/constants";
import { CustomHttpException } from "src/common/exceptions/custom-http.exception";
import {HandleErrors} from "src/common/decorators/handle-errors.decorator";


@Injectable()
export class AuthService{
  constructor(
    private dbController: SqlService,
    private authUtilityService: AuthHelperService,
    private readonly encryptionUtil: EncryptionUtil,
    private readonly toolbox: Tools,
  ) {}

  @HandleErrors()
  async createAccount(new_user: CreateAccountRequestDto): Promise<SessionResponseDto>{
    let response = new SessionResponseDto();
    const userExists = await this.authUtilityService.userExists(new_user.document_number, new_user.document_type);
    if(userExists){ 
      throw new CustomHttpException(ErrorCodeMap.auth.duplicated, new_user.document_number, 'User duplicated', HttpStatus.CONFLICT);
    } 
    const userEntity = {
      ...new_user,
      password: await this.encryptionUtil.hashPassword(new_user.password)
    }
    const params = this.toolbox.jsonToSqlParams(userEntity);
    const publicPassword = this.authUtilityService.generatePublicPassword(10);
    const resultCreateAccount = await this.dbController.executeProcedure('sp_create_account', params);
    if(resultCreateAccount.length === 0){
      throw new CustomHttpException(ErrorCodeMap.auth.uncreatedAccount, '', 'Account dont returned id', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const teacher_id = resultCreateAccount?.[0]?.id;
    const data = {
      document_number: new_user.document_number,
      public_password: publicPassword,
      type_session: sessionTypes.createAccount,
      teacher_id: teacher_id,
    }
    response = await this.authUtilityService.createJWT(data); 
    return response;
  }

  @HandleErrors()
  async login(login_form: LoginRequestDto): Promise<SessionResponseDto>{
    let response = new SessionResponseDto();
    const public_password =  this.authUtilityService.generatePublicPassword(10);
    const params = this.toolbox.jsonToSqlParams({
      document_number: login_form.document_number,
      document_type: login_form.document_type,
    });
    const DBResult = await this.dbController.executeProcedure('sp_get_teacher_session', params);
    if(DBResult.length === 0){
      throw new CustomHttpException(ErrorCodeMap.auth.invalid, '', 'Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const DBPassword = DBResult?.[0]?.teacher_sessionPassword || '';
    const isPasswordCorrect = await this.encryptionUtil.comparePassword(login_form.password, DBPassword); 
    if(!isPasswordCorrect){
      throw new CustomHttpException(ErrorCodeMap.auth.invalid, '', 'Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const data = {
      document_number: login_form.document_number,
      public_password: public_password,
      type_session: sessionTypes.login,
      teacher_id: 0,
    }
    response = await this.authUtilityService.createJWT(data);
    return response;
  }

  @HandleErrors()
  async logout(document_number: string): Promise<SessionResponseDto>{
    let response = new SessionResponseDto();

    const data = {
      document_number: document_number,
      public_password: '',
      type_session: sessionTypes.logout,
      teacher_id: 0,
    }
    const params = this.toolbox.jsonToSqlParams(data);
    const DBResult = await this.dbController.executeProcedure('sp_update_teacher_session', params);
    if(DBResult.length === 0){
      throw new CustomHttpException(ErrorCodeMap.auth.logoutError, '', 'Invalid document number', HttpStatus.UNAUTHORIZED);	
    }
    response.message = successMessages.logout.replace('@name', DBResult?.[0]?.name || '');

    return response;
  }

}
