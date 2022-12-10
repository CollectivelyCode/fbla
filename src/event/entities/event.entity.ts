import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

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

}


export enum EventType {
    Sports,
    NonSport
}
