import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import configuration from './config';
import { AnswerModule } from './answer/answer.module';
import { CoreModule } from './core/core.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
      load: [configuration],
    }),
    ScheduleModule.forRoot(),
    MikroOrmModule.forRoot(),
    CoreModule,
    AnswerModule,
    ReportModule,
  ],
})
export class AppModule {}
