import { Module } from "@nestjs/common";
import { StudentController } from "./student.controller";
import { StudentService } from "./student.service";
import { StudentHelperService } from "./services/studentHelper.service";

@Module({
  controllers:[StudentController],
  providers:[StudentService, StudentHelperService],
  exports:[],
})

export class StudentModule {}
