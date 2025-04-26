import {  Post, Get, Put, Query, Res, UseGuards, Controller, Body } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { HttpStatus } from "@nestjs/common";
import { StudentService } from "./student.service";
import { CreateListRequestDto } from "./dto";
import { Response } from "express";

@Controller('student')
export class StudentController{
  constructor(
    private readonly studentService: StudentService,
  ){}

  @Post('create-student-list')
  async createStudentList(@Body() new_list: CreateListRequestDto, @Res() res: Response){
    const result = await this.studentService.createStudentList(new_list);
    res.status(HttpStatus.OK).json(result);
  }

  @Get('get-all-list')
  async getAllTeachersList(@Query('document') document_number: string, @Res() res: Response){
    const result = await this.studentService.getAllTeachersList(document_number);
    res.status(HttpStatus.OK).json(result);
  }

}

