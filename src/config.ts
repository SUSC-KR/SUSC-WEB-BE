function assertNotEmpty(
  value: string | null | undefined,
  name: string,
): asserts value is string {
  if (!value) {
    throw new Error(`Missing required config: ${name}`);
  }
}

function validateReportWeekdays(weekdays: string[]): string[] {
  const validWeekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  if (weekdays.length === 0) {
    throw new Error('REPORT_WEEKDAYS cannot be empty');
  }

  const invalidWeekdays = weekdays.filter(
    (day) => !validWeekdays.includes(day),
  );

  if (invalidWeekdays.length > 0) {
    throw new Error(
      `Invalid weekdays in REPORT_WEEKDAYS: ${invalidWeekdays.join(', ')}. ` +
        `Valid values are: ${validWeekdays.join(', ')}`,
    );
  }

  // 중복 제거
  const uniqueWeekdays = [...new Set(weekdays)];

  if (uniqueWeekdays.length !== weekdays.length) {
    throw new Error('REPORT_WEEKDAYS contains duplicate values');
  }

  return uniqueWeekdays;
}

export type AppConfig = {
  apiKey: string;
  managerToken: string;
  discord: {
    botToken: string;
    guildId: string;
    channelId: string;
    reportWeekdays: string[];
  };
};

export default () => {
  assertNotEmpty(process.env.API_KEY, 'API_KEY');
  assertNotEmpty(process.env.MANAGER_TOKEN, 'MANAGER_TOKEN');
  assertNotEmpty(process.env.DISCORD_BOT_TOKEN, 'DISCORD_BOT_TOKEN');
  assertNotEmpty(process.env.DISCORD_GUILD_ID, 'DISCORD_GUILD_ID');
  assertNotEmpty(process.env.DISCORD_CHANNEL_ID, 'DISCORD_CHANNEL_ID');

  const reportWeekdays = process.env.REPORT_WEEKDAYS?.trim()
    ? process.env.REPORT_WEEKDAYS.split(',')
        .map((day) => day.trim().toUpperCase())
        .filter((day) => day.length > 0)
    : ['MON', 'TUE', 'WED', 'THU', 'FRI'];

  // REPORT_WEEKDAYS 유효성 검사
  const validatedWeekdays = validateReportWeekdays(reportWeekdays);

  const config: AppConfig = {
    apiKey: process.env.API_KEY,
    managerToken: process.env.MANAGER_TOKEN,
    discord: {
      botToken: process.env.DISCORD_BOT_TOKEN,
      guildId: process.env.DISCORD_GUILD_ID,
      channelId: process.env.DISCORD_CHANNEL_ID,
      reportWeekdays: validatedWeekdays,
    },
  };
  return config;
};
