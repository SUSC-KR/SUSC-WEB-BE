function assertNotEmpty(
  value: string | null | undefined,
  name: string,
): asserts value is string {
  if (!value) {
    throw new Error(`Missing required config: ${name}`);
  }
}

export type AppConfig = {
  apiKey: string;
  managerToken: string;
};

export default () => {
  assertNotEmpty(process.env.API_KEY, 'API_KEY');
  assertNotEmpty(process.env.MANAGER_TOKEN, 'MANAGER_TOKEN');

  const config: AppConfig = {
    apiKey: process.env.API_KEY,
    managerToken: process.env.MANAGER_TOKEN,
  };
  return config;
};
