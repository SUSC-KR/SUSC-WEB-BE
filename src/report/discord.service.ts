import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  TextChannel,
} from 'discord.js';
import { AppConfig } from '../config';

@Injectable()
export class DiscordService implements OnModuleInit {
  private readonly logger = new Logger(DiscordService.name);
  private client: Client;
  private config: AppConfig['discord'];

  constructor(private configService: ConfigService<AppConfig>) {
    this.config = this.configService.get('discord', { infer: true })!;
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds],
    });
  }

  async onModuleInit() {
    try {
      await this.client.login(this.config.botToken);
      this.logger.log('Discord bot connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect Discord bot', error);
    }
  }

  async sendReportEmbed(formReports: Array<{ formId: string; count: number }>) {
    try {
      const channel = (await this.client.channels.fetch(
        this.config.channelId,
      )) as TextChannel;

      if (!channel) {
        throw new Error('Channel not found');
      }

      const embed = new EmbedBuilder()
        .setTitle('📊 일일 폼 응답 현황')
        .setColor(0x617be9)
        .setTimestamp();

      if (formReports.length === 0) {
        embed.setDescription('오늘 제출된 폼 응답이 없습니다.');
      } else {
        const description = formReports
          .map((report) => `- ${report.formId}: ${report.count}`)
          .join('\n');
        embed.setDescription(description);
      }

      await channel.send({ embeds: [embed] });
      this.logger.log('Report sent successfully to Discord');
    } catch (error) {
      this.logger.error('Failed to send Discord report', error);
      throw error;
    }
  }
}
