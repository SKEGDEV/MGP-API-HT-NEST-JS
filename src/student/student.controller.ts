import {  Post, Get, Put, Query, Res, UseGuards, Controller } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { HttpStatus } from "@nestjs/common";
import { StudentService } from "./student.service";

@Controller('student')
export class StudentController{
  constructor(
    private readonly studentService: StudentService,
  ){}

}

