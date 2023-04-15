import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {Repository} from "typeorm";
import {UserRole} from "../../enum/UserRole";

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async create(createUserDto: CreateUserDto & {roles: UserRole[]} ) {
    const user = this.userRepository.create(createUserDto)
    await this.userRepository.save(user)
    return user
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: number) {
   return await this.userRepository.findOneBy({id: id})
  }
  async findOneByUsername(username: string){
   return await this.userRepository.findOne({
      where: {
        username: username
      },
     relations: {
        student: true
     }
   })
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
