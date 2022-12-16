import {OmitType, PartialType} from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';
import {EventType} from "../entities/event.entity";

export class UpdateEventDto {
    name: string
    date: string
    points: number
    eventType: EventType
}
