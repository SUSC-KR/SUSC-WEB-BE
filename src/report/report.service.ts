import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { EntityManager } from '@mikro-orm/sqlite';
import { DiscordService } from './discord.service';
import { AppConfig } from '../config';

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);
  private config: AppConfig['discord'];

  constructor(
    private readonly em: EntityManager,
    private discordService: DiscordService,
    private configService: ConfigService<AppConfig>,
  ) {
    this.config = this.configService.get('discord', { infer: true })!;
  }

  @Cron('0 22 * * *', { timeZone: 'Asia/Seoul' })
  async sendDailyReport() {
    this.logger.log('Starting daily report generation');

    try {
      const currentDay = this.getCurrentWeekday();

      if (!this.config.reportWeekdays.includes(currentDay)) {
        this.logger.log(
          `Skipping report for ${currentDay} - not in configured weekdays`,
        );
        return;
      }

      const formReports = await this.getFormAnswerCounts();

      await this.discordService.sendReportEmbed(formReports);

      this.logger.log('Daily report completed successfully');
    } catch (error) {
      this.logger.error('Failed to send daily report', error);
    }
  }

  private getCurrentWeekday(): string {
    const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const now = new Date();
    return weekdays[now.getDay()];
  }

  private async getFormAnswerCounts(): Promise<
    Array<{ formId: string; count: number }>
  > {
    const knex = this.em.getKnex();
    const result: { formId: string; count: number }[] = await knex(
      'FormAnswer as fa',
    )
      .select('fa.form_id as formId')
      .count('fa.id as count')
      .groupBy('fa.form_id');

    return result.sort((a, b) => a.formId.localeCompare(b.formId));
  }

  async sendTestReport() {
    this.logger.log('Sending test report');
    try {
      const formReports = await this.getFormAnswerCounts();
      await this.discordService.sendReportEmbed(formReports);
      this.logger.log('Test report sent successfully');
    } catch (error) {
      this.logger.error('Failed to send test report', error);
      throw error;
    }
  }
}
