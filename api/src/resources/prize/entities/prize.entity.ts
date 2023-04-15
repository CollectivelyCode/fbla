import {Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {PrizeRedemption} from "./prizeRedemption.entity";
@Entity()
export class Prize {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name: string
    @Column()
    selfRedeemable: boolean
    @Column({type: "int"})
    pointsRequired?: number

    @Column()
    stock?: number

    @OneToMany(() => PrizeRedemption, (prizeRedemption) => prizeRedemption.prize)
    redemptions: PrizeRedemption[]


}
