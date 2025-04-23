import {  Controller, Post, Body, Query, Res, UseGuards } from "@nestjs/common";
import {Response} from "express";
import { CreateAccountRequestDto } from "./dto/create_account.dto";
import { LoginRequestDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { HttpStatus } from "@nestjs/common";
import { AuthGuard } from "./auth.guard";


@Controller('auth')
export class AuthController{
  constructor(private readonly authService: AuthService) {}

  @Post('create-account')
  async createAccount(@Body() new_user: CreateAccountRequestDto, @Res() res: Response){ 
    const result = await this.authService.createAccount(new_user);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('login')
  async Login(@Body() login_form: LoginRequestDto, @Res() res: Response){
    const result =  await this.authService.login(login_form); 
    return res.status(HttpStatus.OK).json(result);  
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async Logout(@Query('document') document: string, @Res() res: Response){
    const result = await this.authService.logout(document);
    return res.status(HttpStatus.OK).json(result); 
  }
}
