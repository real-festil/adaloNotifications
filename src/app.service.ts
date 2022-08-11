import { Injectable, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import axios from 'axios';
import { CronJob } from 'cron';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import * as moment from 'moment';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  createCronJob(
    appId,
    email,
    titleText,
    bodyText,
    date,
    schedulerRegistry,
    token,
  ) {
    const job = new CronJob(new Date(date), async () => {
      console.log(`time (${email}) for job ${email} to run!`);
      const res = await axios.post(
        'https://api.adalo.com/notifications',
        {
          appId: appId,
          audience: { email: email },
          notification: {
            titleText: titleText,
            bodyText: bodyText,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log('Adalo res:', res);
    });

    schedulerRegistry.addCronJob(email + JSON.stringify(date), job);
    job.start();
    console.log(`job ${email + JSON.stringify(date)} added for ${date} date!`);
    console.log(
      `jobs list: ${JSON.stringify(schedulerRegistry.getCronJobs())}`,
    );
  }

  async onModuleInit() {
    const notifications = await this.notificationsRepository.find();
    notifications.forEach(async (notification) => {
      if (moment(notification.date).isAfter(new Date())) {
        this.createCronJob(
          notification.appId,
          notification.email,
          notification.titleText,
          notification.bodyText,
          notification.date,
          this.schedulerRegistry,
          notification.token,
        );
      } else {
        await this.notificationsRepository.remove(notification);
      }
    });
  }

  async createNotification(
    appId: string,
    email: string,
    titleText: string,
    bodyText: string,
    date: string,
    schedulerRegistry: SchedulerRegistry,
    token: string,
  ) {
    if (email && appId && date) {
      await this.notificationsRepository.insert({
        appId,
        email,
        titleText,
        bodyText,
        date,
        token,
      });
      this.createCronJob(
        appId,
        email,
        titleText,
        bodyText,
        date,
        schedulerRegistry,
        token,
      );
    }
  }

  async createPayNotification(
    accountId: string,
    amount: string,
    currency: string,
  ) {
    return await axios.post(
      'https://api.adalo.com/notifications',
      {
        appId: 'a35caf30-d872-4178-81ee-69c9d4195a75',
        audience: { email: accountId },
        notification: {
          titleText: `Оплата ${amount} руб прошла успешно!`,
          bodyText: `Ваш тариф продлен еще на месяц.`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ers5u9uvg4mln8qr6icacwy4q`,
        },
      },
    );
  }

  async createRecNotification(
    accountId: string,
    amount: string,
    currency: string,
  ) {
    return await axios.post(
      'https://api.adalo.com/notifications',
      {
        appId: 'a35caf30-d872-4178-81ee-69c9d4195a75',
        audience: { email: accountId },
        notification: {
          titleText: `Успешная рекуррентная оплата!`,
          bodyText: `Оплата ${amount} ${currency} прошла успешно!`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ers5u9uvg4mln8qr6icacwy4q`,
        },
      },
    );
  }

  async createFailNotification(accountId: string) {
    return await axios.post(
      'https://api.adalo.com/notifications',
      {
        appId: 'a35caf30-d872-4178-81ee-69c9d4195a75',
        audience: { email: accountId },
        notification: {
          titleText: 'Ошибка оплаты',
          bodyText: 'Ежемесячное списание денег за ваш тариф не удалось',
        },
      },
      {
        headers: {
          Authorization: `Bearer ers5u9uvg4mln8qr6icacwy4q`,
        },
      },
    );
  }
}

//appId: a35caf30-d872-4178-81ee-69c9d4195a75
//token: ers5u9uvg4mln8qr6icacwy4q

//email 79372708789@mani-kur.ru
