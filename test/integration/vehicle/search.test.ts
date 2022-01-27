import request from 'supertest';
import { useRefreshDatabase } from 'typeorm-seeding';

import { getTestUrl } from '@test/utils/app.utils';

const url = '/vehicles';

describe(`GET ${url}`, () => {
  beforeAll(async () => {
    await useRefreshDatabase();
  });

  it('Should succeed', async () => {
    const response = await request(getTestUrl()).get(url);
    expect(response.statusCode).toEqual(200);
  });
});
