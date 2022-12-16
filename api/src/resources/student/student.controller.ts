import {Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import {EventService} from "../event/event.service";

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService, private readonly eventService: EventService) {}

  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Get()
  findAll() {
    return this.studentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const student = await this.studentService.findOne(id)
    if (!student){
      throw new NotFoundException("Could not find student", {cause: new Error(), description: `Student ${id} could not be found`} )
    }
    return this.studentService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateStudentDto: UpdateStudentDto) {
    const student = await this.studentService.findOne(id)
    if (!student){
      throw new NotFoundException("Could not find student", {cause: new Error(), description: `Student ${id} could not be found`} )
    }
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const student = await this.studentService.findOne(id)
    if (!student){
      throw new NotFoundException("Could not find student", {cause: new Error(), description: `Student ${id} could not be found`} )
    }
    await this.studentService.remove(id);

  }

  @Post(":id/attendance/:event")
  async markAttendance(@Param("id") studentId: number, @Param("event") eventId: number){
    const student = await this.studentService.findOne(studentId)
    const event = await this.eventService.findOne(eventId)
    if (!student){
      throw new NotFoundException("Could not find student", {cause: new Error(), description: `Student ${studentId} could not be found`} )
    }
    if (!event){
      throw new NotFoundException("Could not find event", {cause: new Error(), description: `Event ${eventId} could not be found`} )
    }
    student.eventAttendance.push(event)
    await this.studentService.update(studentId, {
      points: student.points + event.points,
      eventAttendance: student.eventAttendance
    })
  }
}
