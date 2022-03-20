import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { VehicleRepository } from '@db/repositories/vehicle.repository';
import { BookingRepository } from '@repositories/booking.repository';
import { TCreateBookingParams } from './booking.type';
import { TPagination } from '@src/common/types/pagination.type';
import { ESortBy } from './booking.constants';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(BookingRepository)
    private bookingRepository: BookingRepository,
    @InjectRepository(VehicleRepository)
    private vehicleRepository: VehicleRepository,
  ) {}

  async getBookings(userId: string, paginationParams: TPagination) {
    const { page, pageSize, sortBy, sortDirection } = paginationParams;

    const [bookings, totalRecordCount] =
      await this.bookingRepository.findAndCount({
        where: {
          userId,
        },
        order: {
          [ESortBy[sortBy]]: sortDirection,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        relations: ['vehicle', 'vehicle.vehicleModel'],
      });

    return {
      bookings: bookings.map((booking) =>
        booking.toJson({ includePrivateData: true }),
      ),
      pagination: {
        page,
        pageSize,
        totalRecordCount,
      },
    };
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
