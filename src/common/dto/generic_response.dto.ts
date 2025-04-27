

export class GenericResponseDto<T=any>{
  
  success: boolean = true;
  message: string = '';
  excecution_date: Date = new Date();
  result?: T[] = [];


}

