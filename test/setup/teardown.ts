import { INestApplication } from '@nestjs/common';

export default async () => {
  const app = globalThis.__TEST_APP__ as INestApplication;
  if (app) {
    app.close();
  }
};
