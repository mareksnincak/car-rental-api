import { Body, Controller, Post } from '@nestjs/common';

import { BookingService } from './booking.service';
import { CreateBookingDto } from './dtos/create-booking.dto';

@Controller('/bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('/')
  async search(@Body() body: CreateBookingDto) {
    const { vehicleId, from, to } = body;

    const booking = await this.bookingService.createBooking({
      vehicleId,
      from,
      to,
    });

    return {
      booking,
    };
  }
}
