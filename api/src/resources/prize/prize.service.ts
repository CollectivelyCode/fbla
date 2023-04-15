import {Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import { CreatePrizeDto } from './dto/create-prize.dto';
import { UpdatePrizeDto } from './dto/update-prize.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {DataSource, FindManyOptions, MoreThan, Repository} from "typeorm";
import {Prize} from "./entities/prize.entity";
import {Student} from "../student/entities/student.entity";
import lodash = require("lodash")
import {PrizeRedemption} from "./entities/prizeRedemption.entity";
import * as dayjs from 'dayjs'
import * as utc from "dayjs/plugin/utc"
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";
import UpdatePrizeRedemptionDto from "./dto/update-prizeRedemption.dto";
@Injectable()
export class PrizeService {
  constructor(@InjectRepository(Prize) private prizeRepository: Repository<Prize>, @InjectRepository(Student)
              private studentRepository: Repository<Student>,
              @InjectRepository(PrizeRedemption) private prizeRedemptionRepository: Repository<PrizeRedemption>,
              private dataSource: DataSource,
  ) {}
  async create(createPrizeDto: CreatePrizeDto) {
    const prize = this.prizeRepository.create(createPrizeDto)
    await this.prizeRepository.save(prize)
    return prize
  }

  findAll() {
    return this.prizeRepository.find()
  }
  find(options: FindManyOptions<Prize>){
    return this.prizeRepository.find(options)
  }

  findOne(id: number) {
    return this.prizeRepository.findOneBy({id: id})
  }
  async getRandomWinnerFromGrade(grade: number){
    const students: Pick<Student, "name"|"id">[] = await this.studentRepository.find({
      select: {
        name: true,
        id: true
      },
      where: {
        grade: grade,
        points: MoreThan(0)
      }
    })
    return students[lodash.random(0, students.length - 1)]

  }
  async findRedemptionById(id: number){
    return this.prizeRedemptionRepository.findOneBy({id: id})
  }
  async findRedemptions(options?: FindManyOptions<PrizeRedemption>){
    return await this.prizeRedemptionRepository.find(options)
  }
  async updateRedemption(id: number, data: UpdatePrizeRedemptionDto){
    await this.prizeRedemptionRepository.update({id: id}, data)
    return this.findRedemptionById(id)
  }
  async deleteRedemption(id: number){
    await this.prizeRedemptionRepository.delete({id})
  }
  async redeemPrize(prizeId: number, studentId: number, origin: "selfService"|"randomFromGrade"|"topFromGrade"){
    const prize = await this.prizeRepository.findOneBy({id: prizeId})
    const student = await this.studentRepository.findOneBy({id: studentId})
    dayjs.extend(utc)
    const time = dayjs().utc().toISOString()
    if (origin == "selfService"){
      await this.studentRepository.decrement({id: studentId}, "points", prize.pointsRequired)
    }
    await this.prizeRepository.decrement({id: prizeId}, "stock", 1)
    const prizeRedemption = await this.prizeRedemptionRepository.create({
      redemptionOrigin: origin,
      redeemedAt: time,
      status: "processing",
      redeemedFor: student,
      prize: prize
    })
    await this.prizeRedemptionRepository.save(prizeRedemption)
  }
  async getTopWinnerFromGrade(grade: number): Promise<Student>{
    const queryBuilder = await this.dataSource.getRepository("student").createQueryBuilder()
    const winner = await queryBuilder.select("student.name")
        .from(Student, "student")
        .where("student.grade = :grade", {grade: grade})
        .andWhere("student.points > 0")
        .orderBy("RANDOM()").limit(1).getOne()
    return winner
  }
  async update(id: number, updatePrizeDto: UpdatePrizeDto) {
    return await this.prizeRepository.update({
      id: id
    }, updatePrizeDto)
  }

  async remove(id: number) {
    return await this.prizeRepository.delete({
      id: id
    })
  }
}
