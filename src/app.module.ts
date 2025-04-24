import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SqlService } from './common/database/sql.service';
import { AuthModule } from './auth/auth.module';
import {JwtModule} from '@nestjs/jwt';
import { StudentModule } from './student/student.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
      signOptions:{expiresIn: '259200s'}
    }),
    AuthModule,
    StudentModule,
  ],
  controllers: [AppController],
  providers: [AppService, SqlService],
})
export class AppModule {}
