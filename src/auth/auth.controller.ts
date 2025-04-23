import {  Controller, Post, Body, Query, Res } from "@nestjs/common";
import {Response} from "express";
import { CreateAccountRequestDto, SessionResponseDto } from "./dto/create_account.dto";
import { LoginRequestDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";


@Controller('auth')
export class AuthController{
  constructor(private readonly authService: AuthService) {}

  @Post('create-account')
  async createAccount(@Body() new_user: CreateAccountRequestDto, @Res() res: Response){ 
    const result = await this.authService.createAccount(new_user);
    if(result.error.statusCode === 200){
      return res.status(200).json(result);
    }
    return res.status(result.error.statusCode).json(result);
  }

  @Post('login')
  async Login(@Body() login_form: LoginRequestDto, @Res() res: Response){
    const result =  await this.authService.login(login_form);
    if(result.error.statusCode === 200){
      return res.status(200).json(result);
    }
    return res.status(result.error.statusCode).json(result);
  }

  @Post('logout')
  async Logout(@Query('document') document: string, @Res() res: Response){
    const result = await this.authService.logout(document);
    if(result.error.statusCode === 200){
      return res.status(200).json(result);
    }
    return res.status(result.error.statusCode).json(result);
  }
}
