import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Event} from "./entities/event.entity";
import {UserRole} from "../../enum/UserRole";
import {Roles} from "../../decorators/roles.decorator";
@Roles(UserRole.ADMIN)
@Injectable()
export class EventService {
    constructor(@InjectRepository(Event) private eventRepository: Repository<Event>) {}
    create(createEventDto: CreateEventDto) {
       return this.eventRepository.create(createEventDto)
    }

    async findAll() {
        return await this.eventRepository.find()
    }

    async findOne(id: number) {
        return await this.eventRepository.findOneBy({id})
    }

    async update(id: number, updateEventDto: UpdateEventDto) {
        return await this.eventRepository.update({id}, updateEventDto)
    }

    async remove(id: number) {
        await this.eventRepository.delete({id})
    }
}
