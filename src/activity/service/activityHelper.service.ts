import { Injectable, HttpStatus } from "@nestjs/common";
import { SqlService } from "src/common/database/sql.service";
import { Tools } from "src/common/utils/tools.util";
import { HandleErrors } from "src/common/decorators/handle-errors.decorator";
import { CustomHttpException } from "src/common/exceptions/custom-http.exception";
import { ErrorCodeMap } from "src/common/constants";


@Injectable()
export class ActivityHelperSeervice{
  constructor(
    private dbController: SqlService,
    private readonly toolbox: Tools,
  ){}

  @HandleErrors()
  async isActivityAvailable(
    classroomListId: number,
    unitNumber: number,
    activityQualification: number): Promise<boolean>{
      const params = this.toolbox.jsonToSqlParams({
	clist: classroomListId,
	u_number: unitNumber,
      });
      const DBResult = await this.dbController.executeProcedure('sp_get_total_points', params);
      if(DBResult.length === 0){
	throw new CustomHttpException(
	  ErrorCodeMap.activity.activityUnavailable,
	  '',
	  'Activity cant be evaluated because classroom list dont exist',
	  HttpStatus.CONFLICT
	);
      }
      const currentPoints: number = DBResult?.[0]?.currentQualification;
      if(currentPoints + activityQualification > 100){
	return false;
      }
      return true;
  }

}
