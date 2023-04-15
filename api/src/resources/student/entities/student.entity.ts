import {Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Event} from "../../event/entities/event.entity";
import {User} from "../../user/entities/user.entity";
import {PrizeRedemption} from "../../prize/entities/prizeRedemption.entity";
import {EventAttendance} from "../../event/entities/eventAttendance.entity";

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

    @OneToMany(() => EventAttendance, (eventAttendance) => eventAttendance.student)
    @JoinTable()
    attendanceRecords: EventAttendance[]

    @OneToMany(() => PrizeRedemption, (prizeRedemption) => prizeRedemption.redeemedFor)
    prizeRedemptions: PrizeRedemption[]

    @OneToOne(() => User, (user) => user.student)
    user: User
}



