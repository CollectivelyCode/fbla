import {ApiProperty} from "@nestjs/swagger";
import {IsDateString, MinDate} from "class-validator";
import {EventType} from "../entities/event.entity";

export class CreateEventDto {
    @ApiProperty()
    name: string
    @ApiProperty()
    description: string
    @ApiProperty()
    startDate: string
    @ApiProperty()
    endDate: string
    @ApiProperty()
    points: number
    @ApiProperty()
    eventType: EventType
    @ApiProperty()
    attendanceCodeRequired: boolean
}
