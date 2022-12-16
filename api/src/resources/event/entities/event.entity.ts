import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Student} from "../../student/entities/student.entity";

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name: string
    @Column({type: "date"})
    date: string
    @Column()
    points: number
    @Column()
    eventType: EventType
    @ManyToMany(type => Student, student => student.eventAttendance)
    attendees: Student[]

}


export enum EventType {
    Sports,
    NonSport
}
