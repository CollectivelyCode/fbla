import {ApiProperty} from "@nestjs/swagger";
import {Student} from "../../student/entities/student.entity";

export class CreateUserDto {
    @ApiProperty()
    passwordHash: string
    @ApiProperty()
    username: string
    @ApiProperty()
    student?: Student
}
