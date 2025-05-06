import { Type } from "class-transformer";

export class StudentFileResponseDto{
  message: string = "";
  excecution_date: Date = new Date();
  @Type(() => StudentInfoDto)
  student: StudentInfoDto[] = [];
  @Type(() => ClassroomInfoDto)
  classroom: ClassroomInfoDto[] = [];
  @Type(() => StudentActivitiesInfoDto)
  activities: StudentActivitiesInfoDto[] = [];

}

export class StudentInfoDto{
  s_name: string;
  code: string;
  l_name: string;
  creation: Date;
  t_name: string;
  birthday: Date;
  mother: string;
  father: string;
  phone: string;
}

export class ClassroomInfoDto{
  name: string;
  type: string;
  cid: number;
}

export class StudentActivitiesInfoDto{
  delivered: number;
  NotDelivered: number;
}
