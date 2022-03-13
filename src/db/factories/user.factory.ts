import { define } from 'typeorm-seeding';
import { User } from '../entities/user.entity';

define(User, () => {
  const user = new User();

  return user;
});
