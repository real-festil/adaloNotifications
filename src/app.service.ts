import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import axios from 'axios';
import { CronJob } from 'cron';

@Injectable()
export class AppService {
  createNotification(
    appId: string,
    email: string,
    titleText: string,
    bodyText: string,
    date: string,
    schedulerRegistry: SchedulerRegistry,
  ) {
    if (email && appId && date) {
      const job = new CronJob(new Date(date), () => {
        console.log(`time (${email}) for job ${email} to run!`);
        axios.post('https://api.adalo.com/notifications', {
          appId: appId,
          audience: { email: email },
          notification: {
            titleText: titleText,
            bodyText: bodyText,
          },
        });
      });

      schedulerRegistry.addCronJob(email + JSON.stringify(date), job);
      job.start();
      console.log(
        `job ${email + JSON.stringify(date)} added for ${date} date!`,
      );
    }
  }
}
