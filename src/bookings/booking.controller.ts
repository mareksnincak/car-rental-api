import { Body, Controller, Post } from '@nestjs/common';

import { BookingService } from './booking.service';
import { CreateBookingDto } from './dtos/create-booking.dto';

@Controller('/bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('/')
  async search(@Body() body: CreateBookingDto) {
    const { vehicleId, fromDate, toDate, driver } = body;

    const booking = await this.bookingService.createBooking({
      vehicleId,
      fromDate,
      toDate,
      driver,
    });

    return {
      booking,
    };
  }
}
