import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './resources/event/event.module';
import { StudentModule } from './resources/student/student.module';
import {TypeOrmModule, TypeOrmModuleOptions} from "@nestjs/typeorm";
import {Event} from "./resources/event/entities/event.entity";
import {Student} from "./resources/student/entities/student.entity";
import { UserModule } from './resources/user/user.module';
import {DataSource} from "typeorm";
import {User} from "./resources/user/entities/user.entity";
import { AuthModule } from './auth/auth.module';
import {ThrottlerGuard, ThrottlerModule} from "@nestjs/throttler";
import {APP_GUARD} from "@nestjs/core";
import {AdminAuthCode} from "./auth/entities/admin-auth-code.entity";
import { PrizeModule } from './resources/prize/prize.module';
import {Prize} from "./resources/prize/entities/prize.entity";
import { AnalyticsModule } from './analytics/analytics.module';
import {PrizeRedemption} from "./resources/prize/entities/prizeRedemption.entity";
import {EventAttendance} from "./resources/event/entities/eventAttendance.entity";
import * as process from "process";
import { ConfigModule } from '@nestjs/config';
// @ts-ignore
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: Number.parseFloat(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Student, Event, User, AdminAuthCode, Prize, PrizeRedemption, EventAttendance],
    }),
    AnalyticsModule,
    AuthModule,
    EventModule,
    PrizeModule,
    StudentModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
// @ts-ignore
export default new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number.parseFloat(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Student, Event, User, AdminAuthCode, Prize, PrizeRedemption, EventAttendance],
});

