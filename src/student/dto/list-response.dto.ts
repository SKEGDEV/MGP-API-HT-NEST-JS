
export class ListDto{
  id: number;
  name: string;
  recordDate: Date;
  status: string;
}

export class ListStudentDto{
  id: number;
  name: string;
  s_code: string;
  birthday: Date;
}

export class Student2UpdateDto{
  student_firstName: string;
  student_lastName: string;
  student_code: string;
  student_birthday: Date;
  student_motherNumber: string;
  student_fatherNumber: string;
  student_phoneNumber: string;
}
