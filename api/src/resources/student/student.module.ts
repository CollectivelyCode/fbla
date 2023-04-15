import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Student} from "./entities/student.entity";
import { Event } from "../event/entities/event.entity"
import {EventService} from "../event/event.service";
import {EventAttendance} from "../event/entities/eventAttendance.entity";
@Module({
  imports: [TypeOrmModule.forFeature([Student, Event, EventAttendance])],
  exports: [TypeOrmModule],
  controllers: [StudentController],
  providers: [StudentService, EventService]
})
export class StudentModule {}
