import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {AuthHelperService} from './services/authHelper.service';
import { SqlService } from 'src/common/database/sql.service';
import { Tools } from 'src/common/utils/tools.util';
import {EncryptionUtil} from 'src/common/utils/encryption.util';
import { AuthGuard } from './auth.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthHelperService, SqlService, EncryptionUtil, Tools, AuthGuard],
  exports: [AuthGuard],
})

export class AuthModule {}

