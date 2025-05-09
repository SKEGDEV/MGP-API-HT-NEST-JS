import {  
  Post,
  Get,
  Put,
  Query,
  Res,
  UseGuards,
  Controller,
  Body,
  HttpStatus,
} from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { StudentService } from "./student.service";
import { CreateListRequestDto, StudentUpdateDto } from "./dto";
import { Response } from "express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags('student')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
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

  @Get('get-all-student')
  async getAllStudentList(
    @Query('listid') listid: number,
    @Query('documentid') documentid: string,
    @Res() res: Response){
    const result = await this.studentService.getStudentList(listid, documentid);
    res.status(HttpStatus.OK).json(result);
  }

  @Get('get-student-2-update')
  async getStudent2Update(
    @Query('studentid') studentid: number,
    @Query('documentid') documentid: string,
    @Res() res: Response){
    const result = await this.studentService.getStudent2Update(studentid, documentid);
    res.status(HttpStatus.OK).json(result);
  }

  @Put('update-student')
  async updateStudent(@Body() student: StudentUpdateDto, @Res() res: Response){
    const result = await this.studentService.updateStudent(student);
    res.status(HttpStatus.OK).json(result);
  }

}

