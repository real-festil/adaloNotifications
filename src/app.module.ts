import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Notification]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ec2-54-73-152-36.eu-west-1.compute.amazonaws.com',
      port: 5432,
      username: 'podwxbvqdlwnpt',
      password:
        '67f4cd4834e973bc5fceba91c1c1708933b37a86bd5fdb48446383a762b06873',
      database: 'd40ekvb56fi7ue',
      entities: [Notification],
      synchronize: true,
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
