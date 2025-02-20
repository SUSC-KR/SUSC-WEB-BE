import { defineConfig, SqliteDriver } from '@mikro-orm/sqlite';

export default defineConfig({
  entities: ['./dist/entities'],
  entitiesTs: ['./src/entities'],
  dbName: 'data.db',
  driver: SqliteDriver,
});
