import { Module } from "@nestjs/common";
import { StudentController } from "./student.controller";
import { StudentService } from "./student.service";
import { SqlService } from "src/common/database/sql.service";
import { Tools } from "src/common/utils/tools.util";

@Module({
  controllers:[StudentController],
  providers:[StudentService, SqlService, Tools],
  exports:[],
})

export class StudentModule {}
