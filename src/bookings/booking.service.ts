import { IsNull, LessThanOrEqual } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { VehicleRepository } from '@db/repositories/vehicle.repository';
import { BookingRepository } from '@repositories/booking.repository';
import { TCreateBookingParams } from './booking.type';
import { BookingUtils } from './booking.utils';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(BookingRepository)
    private bookingRepository: BookingRepository,
    @InjectRepository(VehicleRepository)
    private vehicleRepository: VehicleRepository,
    private bookingUtils: BookingUtils,
  ) {}

  async getCurrentBookings(userId: string) {
    const bookings = await this.bookingRepository.find({
      where: {
        userId,
        fromDate: LessThanOrEqual(new Date()),
        returnedAt: null,
      },
      order: {
        createdAt: 'ASC',
      },
      relations: ['vehicle', 'vehicle.vehicleModel'],
    });

    return bookings.map((booking) =>
      booking.toJson({ includePrivateData: true, includeVehicle: true }),
    );
  }

  async createBooking({
    userId,
    vehicleId,
    fromDate,
    toDate,
    driver,
  }: TCreateBookingParams) {
    const vehicle = await this.vehicleRepository.getOneOrFail({
      where: {
        id: vehicleId,
      },
    });

    const price = vehicle.calculatePrice({
      fromDate,
      toDate,
      driverAge: driver.age,
    });

    const booking = await this.bookingRepository.createAndSaveOrFail({
      userId,
      vehicleId,
      fromDate,
      toDate,
      priceTotal: price.total,
      priceDeposit: price.deposit,
      driverName: driver.name,
      driverAge: driver.age,
      driverEmail: driver.email,
      driverIdNumber: driver.idNumber,
    });

    return booking.toJson({ includePrivateData: true });
  }

  async returnBooking(userId: string, bookingId: string) {
    const returnDate = new Date();

    const [booking, spentAmount] = await Promise.all([
      this.bookingRepository.getOneOrFail({
        where: {
          id: bookingId,
          userId,
          fromDate: LessThanOrEqual(returnDate),
          returnedAt: IsNull(),
        },
        relations: ['vehicle'],
      }),
      this.bookingRepository.getSumOfReturnedBookings(userId),
    ]);

    const discountPercentage =
      this.bookingUtils.getDiscountPercentage(spentAmount);

    const price = booking.vehicle.calculatePrice({
      fromDate: booking.fromDate,
      toDate: booking.toDate,
      driverAge: booking.driverAge,
      returnDate,
      discountPercentage,
    });

    booking.priceTotal = price.total;
    booking.returnedAt = returnDate;
    await this.bookingRepository.save(booking);

    // TODO update vehicle mileage -> run all in transaction
    // TODO add tests

    return booking.toJson({ includePrivateData: true });
  }
}
