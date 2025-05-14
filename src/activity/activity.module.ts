import {Module} from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { ActivityHelperSeervice } from './service/activityHelper.service';

@Module({
  controllers:[ActivityController],
  providers:[ActivityService, ActivityHelperSeervice],
  exports:[],
})

export class ActivityModule {}
