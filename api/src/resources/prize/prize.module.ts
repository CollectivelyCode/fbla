import { Module } from '@nestjs/common';
import { PrizeService } from './prize.service';
import { PrizeController } from './prize.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Prize} from "./entities/prize.entity";
import {Student} from "../student/entities/student.entity";
import {PrizeRedemption} from "./entities/prizeRedemption.entity";
import {StudentService} from "../student/student.service";
import {UserService} from "../user/user.service";
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Prize, User, Student, PrizeRedemption])],
  controllers: [PrizeController],
  providers: [PrizeService, UserService, StudentService],
  exports: [TypeOrmModule]
})
export class PrizeModule {}
