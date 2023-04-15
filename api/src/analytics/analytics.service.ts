import { Injectable } from '@nestjs/common';
import {DataSource} from "typeorm";
import {User} from "../resources/user/entities/user.entity";
import {Student} from "../resources/student/entities/student.entity";
import { PrizeRedemption } from '../resources/prize/entities/prizeRedemption.entity';
import * as dayjs from "dayjs";
import * as utc from "dayjs/plugin/utc";
import * as quarterOfYear from "dayjs/plugin/quarterOfYear";
import {Prize} from "../resources/prize/entities/prize.entity";
import {EventAttendance} from "../resources/event/entities/eventAttendance.entity";
import {Event} from "../resources/event/entities/event.entity";

@Injectable()
export class AnalyticsService {
  constructor(private dataSource: DataSource) {
  }
  async getTotalPointsAccrued() {
    const queryBuilder = await this.dataSource.getRepository("student").createQueryBuilder()
    const sumObject = await queryBuilder.select("SUM(student.points)", "sum")
        .from(Student, "student")
        .getRawOne();
    return sumObject["sum"]
  }
  async getAveragePointBalance(){
    const queryBuilder = await this.dataSource.getRepository("student").createQueryBuilder().from(Student, "student")
    // @ts-ignore
    const totalPoints: number = await queryBuilder.select("SUM(student.points)", "sum")
        .getRawOne()
    // @ts-ignore
    const totalStudents: number = await queryBuilder.select("COUNT(*)")
        .getRawOne()
    // @ts-ignore
    return totalPoints["sum"] / totalStudents["count"]

  }
  async getPrizeRedemptions(startTime: Date, endTime: Date){
    // @ts-ignore
    const {count} = await this.dataSource.createQueryBuilder().select("COUNT(*)").from(PrizeRedemption, "prizeRedemption")
        .where("prizeRedemption.redeemedAt >= :startTime", {startTime: startTime.toISOString()})
        .andWhere("prizeRedemption.redeemedAt <= :endTime", {endTime: endTime.toISOString()})
        .getRawOne()
    return count
  }
  async getEventAttendance(startTime: Date, endTime: Date){
    // @ts-ignore
    const {count} = await this.dataSource.createQueryBuilder().select("COUNT(*)").from(EventAttendance, "eventAttendance")
        .where("eventAttendance.timestamp >= :startTime", {startTime: startTime.toISOString()})
        .andWhere("eventAttendance.timestamp <= :endTime", {endTime: endTime.toISOString()})
        .getRawOne()
    return count
  }
  async getTopPrize(startTime: Date, endTime: Date): Promise<string> {
    const prizeData = await this.dataSource.createQueryBuilder().select("prizeRedemption.prizeId, COUNT(*) AS counted")
        .from(PrizeRedemption, "prizeRedemption")
        .where("prizeRedemption.redeemedAt >= :startTime",
            {startTime: startTime.toISOString()})
        .andWhere("prizeRedemption.redeemedAt <= :endTime", {endTime: endTime.toISOString()})
        .groupBy("prizeRedemption.prizeId")
        .orderBy("counted DESC, prizeRedemption.prizeId")
        .limit(1)
        .getRawOne()
    if (prizeData == undefined){
      return null
    }
    const prize = await this.dataSource.createQueryBuilder().select("prize.name")
        .from(Prize, "prize")
        .where("prize.id = :id", {id: prizeData["prizeId"]}).getOne()
    return prize.name
  }
  async getTopEvent(startTime: Date, endTime: Date){
    const eventData = await this.dataSource.createQueryBuilder()
        .select("eventAttendance.eventId, COUNT(*) AS counted")
        .from(EventAttendance, "eventAttendance")
        .where("eventAttendance.timestamp >= :startTime", {startTime: startTime.toISOString()})
        .andWhere("eventAttendance.timestamp <= :endTime", {
          endTime: endTime.toISOString()
        })
        .groupBy("eventAttendance.id")
        .orderBy("counted DESC, eventAttendance.id")
        .limit(1)
        .getRawOne()
    const event = await this.dataSource.createQueryBuilder()
        .select("event.name")
        .from(Event, "event")
        .where("event.id = :id", {id: eventData["eventId"]})
        .getOne()
    return event.name
  }


  async buildReport(timeSpan: TimeSpan){
    dayjs.extend(utc)
    dayjs.extend(quarterOfYear)
    const startTime = dayjs().startOf(timeSpan).utc().toDate()
    const endTime = dayjs(startTime).endOf(timeSpan).toDate()
    //@ts-ignore
    const startLastPeriod = dayjs(startTime).subtract(1, timeSpan).toDate()
    //@ts-ignore
    const endLastPeriod = dayjs(endTime).subtract(1, timeSpan).toDate()
    const data = {
      averagePointBalance: await this.getAveragePointBalance(),
      totalPointsAccrued:await this.getTotalPointsAccrued(),
      prizeRedemptions: await this.getPrizeRedemptions(startTime, endTime),
      eventAttendance: await this.getEventAttendance(startTime, endTime),
      topPrize: await this.getTopPrize(startTime, endTime),
      topEvent: await this.getTopEvent(startTime, endTime)
    }
    const report = {
      averagePointBalance: {
        title: "Average Point Balance",
        value: data["averagePointBalance"],
        description: `Students, on average racked up ${data["averagePointBalance"]} points`
      },
      totalPointsAccrued: {
        title: "Total Points",
        value: data["totalPointsAccrued"],
        description: `${data["totalPointsAccrued"]}! That's a lot!`
      },
      prizeRedemptions: {
        title: "Total Prize Redemptions",
        value: data["prizeRedemptions"],
        difference: (((await this.getPrizeRedemptions(startLastPeriod, endLastPeriod)
            / data["prizeRedemptions"] - 1) * 100)).toPrecision(4),
      },
      eventAttendance: {
        title: "Event Attendance",
        value: data["eventAttendance"],
        difference: (((await this.getEventAttendance(startLastPeriod, endLastPeriod)
            / data["eventAttendance"]) - 1) * 100).toPrecision(4)
      },
      topPrize: {
        title: `Top Prize this ${timeSpan}`,
        value: data["topPrize"] || "none",
        description: data["topPrize"] ? `${data["topPrize"]} claims grand prize!` : "No prizes redeemed yet"
      },
      topEvent: {
        title: `Top Event this ${timeSpan}`,
        value:  data["topEvent"] || "none",
        description: data["topEvent"] ? `${data["topEvent"]} was the most attended event!` : "No events attended yet"
      }
    }
    return report
  }

}
export type TimeSpan = "week"|"month"|"Q"