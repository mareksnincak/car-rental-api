import faker from 'faker';
import { define } from 'typeorm-seeding';

import { User } from '../entities/user.entity';

define(User, () => {
  const user = new User();

  user.firstName = faker.name.firstName();
  user.lastName = faker.name.lastName();
  user.dateOfBirth = faker.date.between('1960-01-01', '2000-01-01');

  return user;
});
