import { Body, Controller, Post } from '@nestjs/common';
import { Locals } from '@src/common/decorators/express/locals.decorator';
import { User } from '@src/db/entities/user.entity';

import { BookingService } from './booking.service';
import { CreateBookingDto } from './dtos/create-booking.dto';

@Controller('/bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('/')
  async createBooking(
    @Locals('user') user: User,
    @Body() body: CreateBookingDto,
  ) {
    const { vehicleId, fromDate, toDate, driver } = body;

    const booking = await this.bookingService.createBooking({
      userId: user.id,
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
