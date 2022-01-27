import { ConfigService } from '@nestjs/config';
import { useRefreshDatabase, useSeeding } from 'typeorm-seeding';

import { bootstrap } from '@src/app';

export default async () => {
  const app = await bootstrap();

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  /**
   * globalThis is only available in setup and teardown
   * therefore we expose url to be used in tests instead of app
   * and use globalThis only for app shutdown
   */
  globalThis.__TEST_APP__ = app;
  process.env.TEST_URL = `http://localhost:${port}`;

  await useRefreshDatabase();
  await useSeeding();
};
