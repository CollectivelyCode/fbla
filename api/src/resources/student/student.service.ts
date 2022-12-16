import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Student} from "./entities/student.entity";
import {Repository} from "typeorm";

@Injectable()
export class StudentService {
  constructor(@InjectRepository(Student) private studentRepository: Repository<Student>) {
  }
  create(createStudentDto: CreateStudentDto): Student {
    return this.studentRepository.create(createStudentDto)
  }

  async findAll(): Promise<Student[]> {
    return await this.studentRepository.find()
  }

  async findOne(id: number): Promise<Student> {
    return await this.studentRepository.findOneBy({id})
  }

  async update(id: number, updateStudentDto: UpdateStudentDto): Promise<Student> {
    await this.studentRepository.update(id, updateStudentDto)
    return await this.studentRepository.findOneBy({id})
  }

  async remove(id: number): Promise<void> {
    await this.studentRepository.delete({id})
  }

}
