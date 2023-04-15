import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import {PrizeService} from './prize.service';
import {CreatePrizeDto} from './dto/create-prize.dto';
import {UpdatePrizeDto} from './dto/update-prize.dto';
import {ApiCreatedResponse, ApiTags, ApiUnauthorizedResponse} from "@nestjs/swagger";
import {Roles} from "../../decorators/roles.decorator";
import {UserRole} from "../../enum/UserRole";
import {RequestWithUser} from "../../types/RequestWithUser";
import {JwtAuthGuard} from "../../guards/jwt-auth.guard";
import {UserService} from "../user/user.service";
import {FindManyOptions} from "typeorm";
import {Prize} from "./entities/prize.entity";
import UpdatePrizeRedemptionDto from "./dto/update-prizeRedemption.dto";
import * as dayjs from "dayjs";
import * as utc from "dayjs/plugin/utc"

@Controller('prize')
@ApiTags("prize")
@UseGuards(JwtAuthGuard)
export class PrizeController {
  constructor(private readonly prizeService: PrizeService, private readonly userService: UserService) {}

  @Get(":id/drawRandomFromGrades")
  @ApiUnauthorizedResponse({description: "Admin permission required"})
  @Roles(UserRole.ADMIN)
  async getRandomGradeWinners(@Param("id") id: number){
    const winners = {}
    for (let grade = 9; grade < 13; grade++) {
      winners[grade] = {
        ...await this.prizeService.getRandomWinnerFromGrade(grade)
      }
      if (Object.keys(winners[grade]).length !== 0) {
        await this.prizeService.redeemPrize(id, winners[grade].id, "randomFromGrade")
      }
    }
    return winners
  }
  @Get(":id/drawTopFromGrades")
  @ApiUnauthorizedResponse({description: "Admin permission required"})
  @Roles(UserRole.ADMIN)
  async getTopGradeWinners(@Param("id") id: number){
    const winners = {}
    for (let grade = 9; grade < 13; grade++) {
      winners[grade] = {
        ...await this.prizeService.getTopWinnerFromGrade(grade)
      }
      if (Object.keys(winners[grade]).length !== 0) {
        await this.prizeService.redeemPrize(id, winners[grade].id, "topFromGrade")
      }
    }
    return winners
  }
  @Post()
  @ApiCreatedResponse({description: "The record has been successfully created"})
  @ApiUnauthorizedResponse({description: "Admin permission required"})
  @Roles(UserRole.ADMIN)
  create(@Body() createPrizeDto: CreatePrizeDto) {
    return this.prizeService.create(createPrizeDto);
  }

  @Get("/find")
  findBy(@Body() options: FindManyOptions<Prize>){
    return this.prizeService.find(options)
  }
  @Get()
  findAll() {
    return this.prizeService.findAll();
  }
  @Get("redeemable")
  findRedeemable(){
    return this.prizeService.find({
      where: {
        selfRedeemable: true
      }
    })
  }
  //@Roles(UserRole.ADMIN)
  @Get("/redemptions")
  findRedemptions(){
    return this.prizeService.findRedemptions()
  }
  @Get("/redemptions/findByStudent/:id")
  findRedemptionsByStudent(@Param("id") id){
    return this.prizeService.findRedemptions({
      where: {
        redeemedFor: {
          id: id
        }
      }
    })
  }
  @Get("/redemptions/:id")
  findRedemption(@Param("id") id: number){
    return this.prizeService.findRedemptionById(id)
  }
  @Patch("/redemptions/:id")
  @Roles(UserRole.ADMIN)
  updateRedemption(@Param("id") id: number, @Body() prizeRedemptionDto: UpdatePrizeRedemptionDto){
    return this.prizeService.updateRedemption(id, prizeRedemptionDto)
  }
  @Roles(UserRole.ADMIN)
  @Delete("/redemptions/:id")
  async deleteRedemption(@Param("id") id: number){
    await this.prizeService.deleteRedemption(id)
  }
  @Roles(UserRole.ADMIN)
  @Post("/redemptions/:id/complete")
  async completeRedemption(@Param("id") id ){
    dayjs.extend(utc)
    await this.updateRedemption(id, {
      status: "fulfilled",
      fulfilledAt: dayjs().utc().toDate()
    })
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prizeService.findOne(+id);
  }
  @Post(":id/redeem")
  //@Roles(UserRole.STUDENT)
  async redeemPrize(@Param("id") id: number, @Request() req: RequestWithUser){
    const user = await this.userService.findOneByUsername(req.user.username)
    const prize = await this.prizeService.findOne(id)
    if (!user.student){
      throw new UnauthorizedException("Only students can redeem prizes")
    }
    if (!prize){
      throw new NotFoundException("Prize not found")
    }
    if (!prize.selfRedeemable || !prize.pointsRequired){
      throw new UnauthorizedException("Prize is not self redeemable")
    }
    if (prize.stock - 1 < 0){
      throw new UnauthorizedException("Prize not in stock")
    }
    if (user.student.points - prize.pointsRequired < 0){
      throw new UnauthorizedException("Student lacks points")
    }
    this.prizeService.redeemPrize(id, user.student.id, "selfService")
    return {
      message: "Prize redeemed"
    }
  }

  @Patch(':id')
  @ApiUnauthorizedResponse({description: "Admin permission required"})
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: number, @Body() updatePrizeDto: UpdatePrizeDto) {
    return this.prizeService.update(id, updatePrizeDto);
  }

  @Delete(':id')
  @ApiUnauthorizedResponse({description: "Admin permission required"})
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: number) {
    return this.prizeService.remove(id);
  }

}
