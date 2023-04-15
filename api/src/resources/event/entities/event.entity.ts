import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Student} from "../../student/entities/student.entity";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {Exclude, Expose} from "class-transformer";
import {EventAttendance} from "./eventAttendance.entity";

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number
    @Column()
    @ApiProperty()
    name: string
    @ApiProperty()
    @Column({
        type: "timestamp with time zone",
        name: "startDate",
        default: (): string => 'LOCALTIMESTAMP'
    })
    startDate: Date
    @ApiProperty()
    @Column({
        type: "timestamp with time zone",
        name: "endDate",
        default: (): string => 'LOCALTIMESTAMP'
    })
    endDate: Date

    @ApiProperty()
    @Column()
    description: string

    @Column()
    @ApiProperty()
    points: number

    @Column({nullable: true})
    //@Expose({groups: ["admin"]})
    @ApiPropertyOptional()
    attendanceCode?: number


    @Column()
    @ApiProperty({enum: ["Sports", "NonSport"]})
    eventType: EventType
    @OneToMany(() => EventAttendance, (eventAttendance) => eventAttendance.event, {})
    @JoinTable()
    attendanceRecords: Promise<EventAttendance[]>

}


export enum EventType {
    Sports = "Sports",
    NonSport = "NonSport"
}