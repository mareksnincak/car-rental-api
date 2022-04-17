import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { Locals } from '@src/common/decorators/express/locals.decorator';
import { User } from '@src/db/entities/user.entity';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { ReturnBookingDto } from './dtos/return-booking.dto';

@Controller('/bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('/current')
  async getCurrentBookings(@Locals('user') user: User) {
    const bookings = await this.bookingService.getCurrentBookings(user.id);

    return {
      data: bookings,
    };
  }

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

    return booking;
  }

  @Post('/returns')
  @HttpCode(HttpStatus.OK)
  async returnBooking(
    @Locals('user') user: User,
    @Body() body: ReturnBookingDto,
  ) {
    const { id, mileage } = body;

    const booking = await this.bookingService.returnBooking({
      userId: user.id,
      bookingId: id,
      mileage,
    });

    return booking;
  }
}
