import { ConfigService } from '@nestjs/config';
import mockdate from 'mockdate';

import { bootstrap } from '@src/app';
import { MOCKED_DATE } from '@test/data/mocks/date.mock';
import { initDb } from '@test/utils/typeorm-seeding.utils';

export default async () => {
  /**
   * We mock app date to be able to use static date values and pass validations.
   * Sideeffect of this is that jest will show  total duration = 0
   * and it mocking is limited but tests will run quicker.
   * In case this doesn't suit your test case you can create
   * new app instance for that specific use case.
   */
  mockdate.set(MOCKED_DATE);

  const app = await bootstrap();
  await initDb();
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  /**
   * globalThis is only available in setup and teardown
   * therefore we expose url to be used in tests instead of app
   * and use globalThis only for app shutdown
   */
  globalThis.__TEST_APP__ = app;
  process.env.TEST_URL = `http://localhost:${port}`;
};
