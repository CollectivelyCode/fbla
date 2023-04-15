import {Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {LessThanOrEqual, MoreThanOrEqual, Repository} from "typeorm";
import {Event} from "./entities/event.entity";
import {UserRole} from "../../enum/UserRole";
import {Roles} from "../../decorators/roles.decorator";
import {Student} from "../student/entities/student.entity";
import SecureRNG from "secure-rng";
import {EventAttendance} from "./entities/eventAttendance.entity";
import {User} from "../user/entities/user.entity";
import * as dayjs from "dayjs";
import * as utc from "dayjs/plugin/utc";
@Roles(UserRole.ADMIN)
@Injectable()
export class EventService {
    constructor(@InjectRepository(Event) private eventRepository: Repository<Event>,
                @InjectRepository(Student) private studentRepository: Repository<Student>,
                @InjectRepository(EventAttendance) private eventAttendanceRepository: Repository<EventAttendance>){}
    async create(createEventDto: Omit<CreateEventDto, "attendanceCodeRequired">, codeRequired: boolean) {
        if (codeRequired){
            const event = this.eventRepository.create({
                attendanceCode: SecureRNG.GenerateInteger(1000, 9999),
                ...createEventDto
            });
            await this.eventRepository.save(event)
            return event
        }
        else {
            const event = this.eventRepository.create(createEventDto)
            await this.eventRepository.save(event)
            return event
        }
    }

    async findAll() {
        return await this.eventRepository.find()
    }
    async findCurrentEvents(): Promise<Event[]>{
        const date = Date()
        return await this.eventRepository.createQueryBuilder("event")
            .where("event.startDate < CURRENT_TIMESTAMP AND event.endDate > CURRENT_TIMESTAMP")
            .getMany()
    }

    async findOne(id: number): Promise<Event> {
        return await this.eventRepository.findOne({
            where: {
                id: id
            }
        })
    }

    async update(id: number, updateEventDto: UpdateEventDto) {
        await this.eventRepository.update({id}, updateEventDto)
        return await this.eventRepository.findOneBy({id})
    }

    async remove(id: number) {
        await this.eventRepository.delete({id})
    }
    async addAttendance(eventId: number, studentId: number, attendanceCode?: number){
        dayjs.extend(utc)
        const event = await this.eventRepository.findOneBy({id: eventId})
        const student = await this.studentRepository.findOne({
            where: {
                id: studentId
            }
        })
        if (!event){
            throw new NotFoundException("Could not find the event")
        }
        if(!student){
            throw new NotFoundException("Could not find student")
        }
        if (!attendanceCode && event.attendanceCode){
            throw new UnauthorizedException({
                message: "This event requires a code to mark attendance",
                code: 604
            })
        }
        if (event.attendanceCode.toString() != attendanceCode.toString() && event.attendanceCode){
            throw new UnauthorizedException({
                message: "The event code is invalid",
                code: 601
            })
        }
        const eventAttendanceRecord = await this.eventAttendanceRepository.create({
            student: student,
            event: event,
            timestamp: dayjs().utc().toISOString(),
            pointsAdded: event.points
        })
        await this.eventAttendanceRepository.save(eventAttendanceRecord)
    }

    async hasStudentAttended(eventId: number, studentId: number){
        const students = await this.eventAttendanceRepository
        return this.eventAttendanceRepository.findOne({
            where: {
                event: await this.findOne(eventId)["id"],
                student: await this.studentRepository.findOneBy({id: studentId})["id"]
            }
        })
    }
}
