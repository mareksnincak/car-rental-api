import { useRefreshDatabase } from 'typeorm-seeding';

export const useRefreshDatabaseWithMigrations = async () => {
  const connection = await useRefreshDatabase();
  await connection.runMigrations();
};
