import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Student} from "../../student/entities/student.entity";
import {Event} from "./event.entity"
@Entity()
export class EventAttendance {
    @PrimaryGeneratedColumn()
    id: string

    @ManyToOne(() => Student, (student) => student.attendanceRecords, {
        eager: true
    })
    student: Student

    @ManyToOne(() => Event, (event) => event.attendanceRecords, {
        eager: true
    })
    event: Event
    @Column({type: "timestamp with time zone"})
    timestamp: Date
    @Column()
    pointsAdded: number
}