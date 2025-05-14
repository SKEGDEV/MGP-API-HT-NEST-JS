import {
  Post,
  Get,
  Query,
  Put,
  Res,
  UseGuards,
  Controller,
  Body,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ActivityService } from './activity.service';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  requestCreateActivityDto,
  requestQualficateActivityDto,
} from './dto';

@ApiTags('activity') 
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
@Controller('activity')
export class ActivityController{
  constructor(
    private readonly activityService: ActivityService,
  ){}

  @Post('create-activity')
  async createActivity(
    @Body() newActivity: requestCreateActivityDto,
    @Res() res: Response,
  ){
    const result = await this.activityService.createActivity(newActivity);
    res.status(HttpStatus.OK).json(result);
  }

  @Get('get-all-activity')
  async getAllActivity(
    @Query('classroomlistid') classroomListId: number,
    @Query('unitnumber') unitNumber: number,
    @Query('documentid') documentid: string,
    @Res() res: Response,
  ){
    const result = await this.activityService.getAllActivity(classroomListId, unitNumber, documentid);
    res.status(HttpStatus.OK).json(result);
  }

  @Get('get-all-student-activity')
  async getAllStudentActivity(
    @Query('activityid') activityid: number,
    @Query('documentid') documentid: string,
    @Res() res: Response,
  ){
    const result = await this.activityService.getAllStudentActivity(activityid, documentid);
    res.status(HttpStatus.OK).json(result);
  }

  @Get('get-student-to-qualify')
  async getStudentToQualify( 
    @Query('student_activity_id') studentActivityId: number,
    @Query('documentid') documentid: string,
    @Res() res: Response,
  ){
    const result = await this.activityService.getStudentToQualify(studentActivityId, documentid);
    res.status(HttpStatus.OK).json(result);
  }

  @Put('qualify-activity')
  async qualifyActivity(
    @Body() qualification: requestQualficateActivityDto, 
    @Res() res: Response,
  ){
    const result = await this.activityService.qualifyActivity(qualification);
    res.status(HttpStatus.OK).json(result);
  }
}

