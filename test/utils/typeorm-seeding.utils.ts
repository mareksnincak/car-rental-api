import { useRefreshDatabase } from 'typeorm-seeding';

export const useMigratedRefreshDatabase = async () => {
  const connection = await useRefreshDatabase();
  await connection.runMigrations();
};
