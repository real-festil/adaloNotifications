import { Post } from '@nestjs/common';
import { Body, Controller, Get } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  @Post()
  createNotification(
    @Body()
    body: {
      date: string;
      appId: string;
      email: string;
      titleText: string;
      bodyText: string;
    },
  ): any {
    console.log(`body`, body);
    return this.appService.createNotification(
      body.appId,
      body.email,
      body.titleText,
      body.bodyText,
      body.date,
      this.schedulerRegistry,
    );
  }
}
