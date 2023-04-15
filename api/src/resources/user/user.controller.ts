import {Body, Controller, Delete, Get, Param, Patch, Request, UnauthorizedException} from '@nestjs/common';
import {UserService} from './user.service';
import {UpdateUserDto} from './dto/update-user.dto';
import {Roles} from "../../decorators/roles.decorator";
import {UserRole} from "../../enum/UserRole";
import {StudentService} from "../student/student.service";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number, @Request() req) {
    if (!req.user || (req.user.id != id && req.user.roles?.includes(UserRole.ADMIN))){
      throw new UnauthorizedException()
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
