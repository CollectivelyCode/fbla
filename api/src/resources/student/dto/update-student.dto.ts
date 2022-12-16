import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './create-student.dto';
import {Student} from "../entities/student.entity";
import {Event} from "../../event/entities/event.entity";
import {IsNotEmpty} from "class-validator";

export class UpdateStudentDto extends PartialType(Student) {

    points?: number

}
