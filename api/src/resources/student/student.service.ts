import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Student} from "./entities/student.entity";
import {FindOneOptions, Repository} from "typeorm";

@Injectable()
export class StudentService {
  constructor(@InjectRepository(Student) private studentRepository: Repository<Student>) {
  }
  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const student = this.studentRepository.create({
      points: 0,
      ...createStudentDto
    })
    await this.studentRepository.save(student)
    return student
  }

  async findAll(): Promise<Student[]> {
    return await this.studentRepository.find()
  }

  async findOneById(id: number): Promise<Student> {
    return await this.studentRepository.findOneBy({id})
  }
  async findOne(options: FindOneOptions<Student>): Promise<Student> {
    return await this.studentRepository.findOne(options)
  }
  async update(id: number, updateStudentDto: UpdateStudentDto): Promise<Student> {
    await this.studentRepository.update(id, updateStudentDto)
    return await this.studentRepository.findOneBy({id})
  }

  async remove(id: number): Promise<void> {
    await this.studentRepository.delete({id})
  }


}
