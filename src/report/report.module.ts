import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ReportService } from './report.service';
import { DiscordService } from './discord.service';
import { ReportController } from './report.controller';
import { FormAnswer } from 'src/entities/form-answer';

@Module({
  imports: [ConfigModule, MikroOrmModule.forFeature([FormAnswer])],
  controllers: [ReportController],
  providers: [ReportService, DiscordService],
  exports: [],
})
export class ReportModule {}
