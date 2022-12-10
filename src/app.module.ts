import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './event/event.module';
import { StudentModule } from './student/student.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Event} from "./event/entities/event.entity";
import {Student} from "./student/entities/student.entity";
import { UserModule } from './user/user.module';

@Module({
  imports: [EventModule, StudentModule, TypeOrmModule.forRoot({
    type: "sqlite",
    database: "../something.db",
    entities: [Event, Student]
  }), UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
