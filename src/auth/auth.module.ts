import {Module, Global} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {AuthHelperService} from './services/authHelper.service';
import { AuthGuard } from './auth.guard';

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthHelperService, AuthGuard],
  exports: [AuthGuard],
})

export class AuthModule {}

