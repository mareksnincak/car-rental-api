import { DeepPartial, EntityRepository, Repository } from 'typeorm';

import { Booking } from '@entities/booking.entity';

@EntityRepository(Booking)
export class BookingRepository extends Repository<Booking> {
  async createAndSave(entityLike: DeepPartial<Booking>) {
    const booking = this.create(entityLike);
    return this.save(booking);
  }
}
