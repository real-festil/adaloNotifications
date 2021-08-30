import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import axios from 'axios';
import { CronJob } from 'cron';

@Injectable()
export class AppService {
  async createNotification(
    appId: string,
    email: string,
    titleText: string,
    bodyText: string,
    date: string,
    schedulerRegistry: SchedulerRegistry,
  ) {
    if (email && appId && date) {
      const job = new CronJob(new Date(date), async () => {
        console.log(`time (${email}) for job ${email} to run!`);
        const res = await axios.post('https://api.adalo.com/notifications', {
          appId: appId,
          audience: { email: email },
          notification: {
            titleText: titleText,
            bodyText: bodyText,
          },
        });
        console.log('Adalo res:', res);
      });

      schedulerRegistry.addCronJob(email + JSON.stringify(date), job);
      job.start();
      console.log(
        `job ${email + JSON.stringify(date)} added for ${date} date!`,
      );
      console.log(`jobs list: ${schedulerRegistry.getCronJobs()}`);
    }
  }
}
