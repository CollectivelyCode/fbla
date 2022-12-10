import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

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
    username: string

}



