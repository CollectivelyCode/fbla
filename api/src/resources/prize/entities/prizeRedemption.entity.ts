import {Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../user/entities/user.entity";
import {Student} from "../../student/entities/student.entity";
import {Prize} from "./prize.entity";

@Entity()
export class PrizeRedemption {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    redemptionOrigin: "randomFromGrade"|"topFromGrade"|"selfService"

    @Column()
    status: "fulfilled"|"cancelled"|"processing"
    @Column({
        type: "timestamp with time zone",
        name: "redeemedAt",
        default: (): string => 'LOCALTIMESTAMP'
    })
    redeemedAt: Date
    @Column({
        type: "timestamp with time zone",
        name: "fulfilledAt",
        nullable: true
    })
    fulfilledAt?: Date

    @ManyToOne(() => Student, (student) => student.prizeRedemptions, {
        eager: true
    })
    @JoinTable()
    redeemedFor: Student

    @ManyToOne(() => Prize, (prize) => prize.redemptions, {
        eager: true
    })
    @JoinTable()
    prize: Prize

    @Column({
        nullable: true
    })
    fulfillmentComments?: string
}