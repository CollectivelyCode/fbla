import {OmitType, PartialType} from '@nestjs/mapped-types';
import {EventType} from "../entities/event.entity";
import {ApiProperty} from "@nestjs/swagger";
import {IsDateString} from "class-validator";

export class UpdateEventDto {
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
}
