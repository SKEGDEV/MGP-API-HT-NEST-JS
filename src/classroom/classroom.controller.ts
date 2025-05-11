import {
  Post,
  Get,
  Query,
  Res,
  UseGuards,
  Controller,
  Body,
  HttpStatus,
} from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { ClassroomService } from "./classroom.service";
import {Response} from "express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import {
  requestCreateClassroomDto,
  requestListToClassroomDto,
} from "./dto";


@ApiTags('classroom')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
@Controller('classroom')
export class ClassroomController{

  constructor(
    private readonly classroomService: ClassroomService,
  ){}

  @Post('create-classroom')
  async createClassroom(
    @Body() newClassroom: requestCreateClassroomDto,
    @Res() res: Response,
  ){
    const result = await this.classroomService.createClassroom(newClassroom);
    res.status(HttpStatus.OK).json(result);
  }

  @Post('import-list-into-classroom')
  async importListIntoClassroom(
    @Body() importedList: requestListToClassroomDto,
    @Res() res: Response,
  ){
    const result = await this.classroomService.importListIntoClassroom(importedList);
    res.status(HttpStatus.OK).json(result);
  }

  @Get('get-all-classroom')
  async getClassroom(
    @Query('documentid') documentid: string,
    @Query('year') year: number,
    @Query('variant') variant: number,
    @Res() res: Response,
  ){
    const result = await this.classroomService.getAllClassroom(documentid, year, variant);
    res.status(HttpStatus.OK).json(result);
  }

  @Get('get-classroom-student')
  async getClassroomStudent(
    @Query('classroomid') classroomid: number,
    @Query('documentid') documentid: string,
    @Query('unitNumber') unitNumber: number,
    @Res() res: Response,
  ){
    const result = await this.classroomService.getAllClassroomStudent(classroomid, unitNumber, documentid);
    res.status(HttpStatus.OK).json(result);
  }

  @Get('get-all-classroom-list')
  async getAllClassroomList(
    @Query('classroomid') classroomid: number,
    @Query('documentid') documentid: string,
    @Res() res: Response,
  ){
    const result = await this.classroomService.getAllClassroomList(classroomid, documentid);
    res.status(HttpStatus.OK).json(result);
  }

}




