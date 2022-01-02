import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BookingRepository } from '@repositories/booking.repository';
import { TBookingParams } from './booking.type';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(BookingRepository)
    private bookingRepository: BookingRepository,
  ) {}

  async createBooking({ vehicleId, fromDate, toDate }: TBookingParams) {
    const booking = await this.bookingRepository.createAndSaveOrFail({
      vehicleId,
      fromDate,
      toDate,
      price: 10,
    });

    return booking.toJson({ includePrivateData: true });
  }
}
