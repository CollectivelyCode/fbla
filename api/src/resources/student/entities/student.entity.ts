import {Column, Entity, ManyToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Event} from "../../event/entities/event.entity";

@Entity()
export class Student {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name: string
    @Column()
    grade: number
    @Column()
    points: number
    @Column()
    userId: number
    @ManyToMany(type => Event, event => event.attendees)
    eventAttendance: Event[]

}



