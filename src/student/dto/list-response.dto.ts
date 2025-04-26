
export class ListDto{
  id: number;
  name: string;
  recordDate: Date;
  status: string;
}

export class ListResponseDto{
  message: string = '';
  result: (ListDto | ListStudentDto)[] = [];
}

export class ListStudentDto{
  id: number;
  name: string;
  s_code: string;
  birthday: Date;
}
