import {ApiProperty} from "@nestjs/swagger";
import { User } from "src/resources/user/entities/user.entity";

export class CreateStudentDto {
    @ApiProperty()
    name: string
    @ApiProperty()
    grade: number
    @ApiProperty()
    user: User
}
