import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { VehicleRepository } from '@db/repositories/vehicle.repository';
import { BookingRepository } from '@repositories/booking.repository';
import { TCreateBookingParams } from './booking.type';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(BookingRepository)
    private bookingRepository: BookingRepository,
    @InjectRepository(VehicleRepository)
    private vehicleRepository: VehicleRepository,
  ) {}

  async getCurrentBookings(userId: string) {
    const bookings = await this.bookingRepository.find({
      where: {
        userId,
        returnedAt: null,
      },
      order: {
        createdAt: 'ASC',
      },
      relations: ['vehicle', 'vehicle.vehicleModel'],
    });

    return bookings.map((booking) =>
      booking.toJson({ includePrivateData: true }),
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
}
