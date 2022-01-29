import { ConfigService } from '@nestjs/config';
import mockdate from 'mockdate';

import { bootstrap } from '@src/app';
import { MOCKED_DATE } from '@test/data/mocks/date.mock';

export default async () => {
  /**
   * We mock app date to be able to use static date values
   * and pass validations. In case you don't want to use
   * dynamic values in your tests create new app instance
   * for that usecase. Sideeffect of this is that jest total
   * duration = 0, but tests will run quicker
   */
  mockdate.set(MOCKED_DATE);

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
};
