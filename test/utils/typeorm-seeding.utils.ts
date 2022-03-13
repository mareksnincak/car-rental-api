import { getConnection } from 'typeorm';
import { useRefreshDatabase } from 'typeorm-seeding';

export const useMigratedRefreshDatabase = async () => {
  const connection = await useRefreshDatabase();
  await connection.runMigrations();
};

export const initDb = async () => {
  const connection = getConnection();
  await connection.query(`
    CREATE EXTENSION IF NOT EXISTS "unaccent";
    CREATE EXTENSION IF NOT EXISTS "btree_gist";
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
  `);
};
