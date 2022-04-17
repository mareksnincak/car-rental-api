import { Connection, IsNull, LessThanOrEqual } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { VehicleRepository } from '@db/repositories/vehicle.repository';
import { BookingRepository } from '@repositories/booking.repository';
import { TCreateBookingParams } from './booking.type';
import { BookingUtils } from './booking.utils';
import { UnprocessableEntityAppException } from '@src/common/exceptions/unprocessable-entity.exception';

@Injectable()
export class BookingService {
  constructor(
    private connection: Connection,
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

  async returnBooking({
    userId,
    bookingId,
    mileage,
  }: {
    userId: string;
    bookingId: string;
    mileage: number;
  }) {
    return this.connection.transaction(async (manager) => {
      const bookingRepository = manager.getCustomRepository(BookingRepository);
      const vehicleRepository = manager.getCustomRepository(VehicleRepository);

      const returnDate = new Date();
      const [booking, spentAmount] = await Promise.all([
        bookingRepository.getOneOrFail({
          where: {
            id: bookingId,
            userId,
            fromDate: LessThanOrEqual(returnDate),
            returnedAt: IsNull(),
          },
          relations: ['vehicle'],
        }),
        bookingRepository.getSumOfReturnedBookings(userId),
      ]);

      const { vehicle } = booking;
      const discountPercentage =
        this.bookingUtils.getDiscountPercentage(spentAmount);

      const price = vehicle.calculatePrice({
        fromDate: booking.fromDate,
        toDate: booking.toDate,
        driverAge: booking.driverAge,
        returnDate,
        discountPercentage,
      });

      booking.priceTotal = price.total;
      booking.returnedAt = returnDate;

      const [vehicleUpdateResult] = await Promise.all([
        vehicleRepository.update(
          {
            id: vehicle.id,
            mileage: LessThanOrEqual(mileage),
          },
          {
            mileage,
          },
        ),
        bookingRepository.save(booking),
      ]);

      if (!vehicleUpdateResult.affected) {
        throw new UnprocessableEntityAppException({
          responseMessage: 'Invalid mileage.',
          resource: 'Vehicle',
          logMessage: `Invalid mileage ${mileage} for vehicle ${vehicle.id}. Booking ${booking.id}`,
        });
      }

      return booking.toJson({ includePrivateData: true });
    });
  }
}
