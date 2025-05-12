
export class responseGetAllActivityDto{
  a_id: number;
  a_name: string;
  a_date: Date;
  a_qualification: number;
  a_type: string;
}

export class responseGetActivityStudentDto{
  id: number;
  name: string;
  code: string;
  l_name: string;
  qualification: number;
}

export class responseStudentToQualifyDto{
  id: number;
  name: string;
  code: string;
  birthday: string;
  current_declarative: number;
  current_attitudinal: number;
  current_procedural: number;
  s_total: number;
  aname: string;
  atype: number;
  atypeName: string;
  declarative: number;
  attitudinal: number;
  procedural: number;
  total: number;
}
