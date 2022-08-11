import { Post } from '@nestjs/common';
import { Body, Controller } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  @Post('/pay')
  payNotification(
    @Body()
    body: {
      AccountId: string;
    },
  ): any {
    console.log(`body`, body);

    return this.appService.createPayNotification(body.AccountId);
  }

  @Post()
  createNotification(
    @Body()
    body: {
      date: string;
      appId: string;
      email: string;
      titleText: string;
      bodyText: string;
      token: string;
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
      body.token,
    );
  }
}
