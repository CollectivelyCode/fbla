import {Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';


@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("report")
  async getReport(@Query("timeSpan") timeSpan){
    return await this.analyticsService.buildReport(timeSpan)
  }

}
