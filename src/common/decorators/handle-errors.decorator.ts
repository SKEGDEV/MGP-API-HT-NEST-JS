import { CustomHttpException } from "../exceptions/custom-http.exception";
import { ErrorCodeMap } from "../constants";
import { HttpStatus } from "@nestjs/common";
import * as sql from "mssql";


export function HandleErrors() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (e) {
        if (e instanceof sql.RequestError || e instanceof sql.ConnectionError) {
          throw new CustomHttpException(
            ErrorCodeMap.auth.internalError,
            '',
            `Database error: ${e.message}`,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        if (e instanceof CustomHttpException) {
          throw e;
        }
        throw new CustomHttpException(
          ErrorCodeMap.auth.internalError,
          '',
          `Unknown error: ${e.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    };

    return descriptor;
  };
}
