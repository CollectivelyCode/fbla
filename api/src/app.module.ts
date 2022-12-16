import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './resources/event/event.module';
import { StudentModule } from './resources/student/student.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Event} from "./resources/event/entities/event.entity";
import {Student} from "./resources/student/entities/student.entity";
import { UserModule } from './resources/user/user.module';
import {DataSource} from "typeorm";
import {User} from "./resources/user/entities/user.entity";
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [EventModule, StudentModule, TypeOrmModule.forRoot({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "fbla",
    entities: [Student, Event, User],
    autoLoadEntities: true
  }), UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
export default new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "fbla",
  entities: [Student, Event, User]
})