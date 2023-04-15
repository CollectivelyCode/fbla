import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request
} from '@nestjs/common';
import {StudentService} from './student.service';
import {UpdateStudentDto} from './dto/update-student.dto';
import {EventService} from "../event/event.service";
import {Roles} from "../../decorators/roles.decorator";
import {UserRole} from "../../enum/UserRole";
import {ApiTags} from "@nestjs/swagger";
import {RequireOwnId} from "../../decorators/RequireOwnId.decorator";

@Controller('student')
@ApiTags("student")
export class StudentController {
  constructor(private readonly studentService: StudentService, private readonly eventService: EventService) {}

  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.studentService.findAll();
  }
  @RequireOwnId(true)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const student = await this.studentService.findOneById(id)
    if (!student){
      throw new NotFoundException("Could not find student", {cause: new Error(), description: `Student ${id} could not be found`} )
    }
    return this.studentService.findOneById(+id);
  }
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateStudentDto: UpdateStudentDto) {
    const student = await this.studentService.findOneById(id)
    if (!student){
      throw new NotFoundException("Could not find student", {cause: new Error(), description: `Student ${id} could not be found`} )
    }
    return this.studentService.update(id, updateStudentDto);
  }
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    const student = await this.studentService.findOneById(id)
    if (!student){
      throw new NotFoundException("Could not find student", {cause: new Error(), description: `Student ${id} could not be found`} )
    }
    await this.studentService.remove(id);

  }
  @RequireOwnId(true)
  @Post(":id/attendance/:event")
  @HttpCode(200)
  async markAttendance(@Request() req, @Param("id") studentId: number, @Param("event") eventId: number){
    const student = await this.studentService.findOneById(studentId)
    const event = await this.eventService.findOne(eventId)
    if (!student){
      throw new NotFoundException("Could not find student")
    }
    if(await this.eventService.hasStudentAttended(eventId, studentId)){
      throw new BadRequestException("Student already attended event")
    }
    await this.studentService.update(studentId, {
      points: student.points + event.points,
    })
    await this.eventService.addAttendance(eventId, studentId, req.body?.attendanceCode)
  }
  @RequireOwnId(true)
  @Get(":id/attendance/:event")
  async getAttendance(@Request() req, @Param("id") studentId: number, @Param("event") eventId: number){
    const student = await this.studentService.findOneById(studentId)
    const event = await this.eventService.findOne(eventId)
    if (!student){
      throw new NotFoundException("Could not find student")
    }
    return {
      hasAttended: await this.eventService.hasStudentAttended(eventId, studentId)
    }
  }
  @RequireOwnId(true)
  @Get(":id/prizes/redemptions")
  async getRedemptions(@Request() req, @Param("id") studentId: number, @Param("event") eventId: number){
    const student = await this.studentService.findOneById(studentId)

  }
}
