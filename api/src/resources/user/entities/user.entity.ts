import { UserRole } from "src/enum/UserRole";
import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Student} from "../../student/entities/student.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    passwordHash: string
    @Column()
    username: string
    @Column({
        type:  "enum",
        enum: UserRole,
        default: UserRole.GHOST
    })
    roles: UserRole[]

}

