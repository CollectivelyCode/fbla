import { UserRole } from "../../../enum/UserRole";
import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Student} from "../../student/entities/student.entity";
import {Generated} from "typeorm";
import {Exclude} from "class-transformer";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    @Generated("increment")
    id: number
    @Column()
    @Exclude()
    passwordHash: string
    @Column()
    username: string
    @Column({
        type:  "enum",
        enum: UserRole,
        default: UserRole.GHOST
    })
    roles: UserRole[]

    @OneToOne(() => Student, (student) => student.user)
    @JoinColumn()
    student: Student

}

