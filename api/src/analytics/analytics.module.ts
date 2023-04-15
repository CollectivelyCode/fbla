import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Student} from "../resources/student/entities/student.entity";
import { PrizeRedemption } from '../resources/prize/entities/prizeRedemption.entity';
import {PrizeModule} from "../resources/prize/prize.module";
import {StudentModule} from "../resources/student/student.module";

@Module({
  imports: [TypeOrmModule.forFeature([Student, PrizeRedemption]), PrizeModule, StudentModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [TypeOrmModule]
})
export class AnalyticsModule {}
