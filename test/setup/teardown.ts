import { INestApplication } from '@nestjs/common';
import mockdate from 'mockdate';

export default async () => {
  const app = globalThis.__TEST_APP__ as INestApplication;

  if (app) {
    await app.close();
  }

  mockdate.reset();
};
