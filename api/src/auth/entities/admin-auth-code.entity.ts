import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class AdminAuthCode {
    @PrimaryColumn()
    authCode: string
    @Column()
    revoked: boolean
    @Column()
    used: boolean
    @Column({type: "timestamp without time zone"})
    createdAt: string
}