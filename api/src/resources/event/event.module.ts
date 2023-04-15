import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import { Event } from "./entities/event.entity"
import {RolesGuard} from "../../guards/roles.guard";
import { APP_GUARD } from '@nestjs/core';
import {Student} from "../student/entities/student.entity";
import {EventAttendance} from "./entities/eventAttendance.entity";
@Module({
  imports: [TypeOrmModule.forFeature([Event, Student, EventAttendance])],
  exports: [TypeOrmModule],
  controllers: [EventController],
  providers: [EventService, {
    provide: APP_GUARD,
    useClass: RolesGuard
  }]
})
export class EventModule {}
