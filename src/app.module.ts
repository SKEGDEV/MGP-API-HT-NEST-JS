import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SqlService } from './common/database/sql.service';
import { AuthModule } from './auth/auth.module';
import {JwtModule} from '@nestjs/jwt';
import { StudentModule } from './student/student.module';
import { CommonModule } from './common/common.module';
import { ClassroomModule } from './classroom/classroom.module';
import { ActivityModule } from './activity/activity.module';

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
    CommonModule,
    AuthModule,
    StudentModule,
    ClassroomModule,
    ActivityModule,
  ],
  controllers: [AppController],
  providers: [AppService, SqlService],
})
export class AppModule {}
