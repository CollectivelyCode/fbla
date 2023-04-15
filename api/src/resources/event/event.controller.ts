import {Body, Controller, Delete, Get, Param, Patch, Post, UseInterceptors} from '@nestjs/common';
import {EventService} from './event.service';
import {CreateEventDto} from './dto/create-event.dto';
import {UpdateEventDto} from './dto/update-event.dto';
import {Roles} from "../../decorators/roles.decorator";
import {UserRole} from "../../enum/UserRole";
import {ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse} from "@nestjs/swagger";
import {Event} from "./entities/event.entity";
import {UpdateResult} from "typeorm";
import {RoleClassSerializer} from "../../interceptors/RoleClassSerializer";
import * as dayjs from 'dayjs'
import * as utc from "dayjs/plugin/utc"
import * as timezone from "dayjs/plugin/timezone"
@ApiTags("event")
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @ApiCreatedResponse({
    type: Event
  })
  @ApiUnauthorizedResponse({description: "Admin permission required"})
  @Roles(UserRole.ADMIN)
  create(@Body() createEventDto: CreateEventDto) {
    dayjs.extend(utc)
    dayjs.extend(timezone)
    return this.eventService.create({
      name: createEventDto.name,
      description: createEventDto.description,
      eventType: createEventDto.eventType,
      points: createEventDto.points,
      startDate: dayjs(createEventDto.startDate).utc().toISOString(),
      endDate: dayjs(createEventDto.endDate).utc().toISOString()
    }, createEventDto.attendanceCodeRequired);
  }
  @Get()
  findAll() {
    return this.eventService.findAll();
  }
  @Get("currentEvents")
  getCurrentEvents(): Promise<Event[]>{
    return this.eventService.findCurrentEvents();
  }
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.eventService.findOne(id);
  }
  @Get(":id/report")
  async getTotalAttendance(@Param("id") id: number){
    const event = await this.eventService.findOne(id)
    const records = await event.attendanceRecords
    return {
      eventAttendance: records.length
    }
}



  @Patch(':id')
  @ApiUnauthorizedResponse({description: "Admin permission required"})
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: number, @Body() updateEventDto: UpdateEventDto): Promise<Event> {
    return this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  @ApiOkResponse({description: "Record has been deleted"})
  @ApiUnauthorizedResponse({description: "Admin permission required"})
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.eventService.remove(+id);
  }
}
