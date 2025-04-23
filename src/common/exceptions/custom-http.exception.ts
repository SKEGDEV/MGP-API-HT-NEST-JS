import { HttpException, HttpStatus } from "@nestjs/common";
import { ErrorParameter } from "../utils/tools.util";

export class CustomHttpException extends HttpException{
  constructor(
    public readonly errorMap: ErrorParameter,
    public readonly data: string,
    public readonly details: string,
    status: HttpStatus,
  ){
      super({message: details}, status);
  }
}
