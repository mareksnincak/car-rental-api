import {
  DeepPartial,
  EntityNotFoundError,
  EntityRepository,
  FindOneOptions,
  QueryFailedError,
  Repository,
} from 'typeorm';

import { Booking } from '@entities/booking.entity';
import { NotFoundAppException } from '@common/exceptions/not-found.exception';
import { EPgErrorCode } from '@db/constants/postgres.constants';
import { EConstraints, EForeignKeys } from '@db/constants/booking.constants';
import { ConflictAppException } from '@common/exceptions/conflict.exception';

@EntityRepository(Booking)
export class BookingRepository extends Repository<Booking> {
  static handleError(error: unknown) {
    if (error instanceof EntityNotFoundError) {
      throw new NotFoundAppException('Booking', error.message);
    }

    if (error instanceof QueryFailedError) {
      const queryFailedError = error as QueryFailedError & {
        code: string;
        constraint: string;
      };

      if (
        queryFailedError.code === EPgErrorCode.foreignKeyViolation &&
        queryFailedError.constraint === EForeignKeys.vehicle
      ) {
        throw new NotFoundAppException('Vehicle', error.message);
      }

      if (
        queryFailedError.code === EPgErrorCode.exclusionViolation &&
        queryFailedError.constraint === EConstraints.overlappingBookings
      ) {
        throw new ConflictAppException('Booking', error.message);
      }
    }

    throw error;
  }

  async saveOrFail(entity: Booking) {
    try {
      return await this.save(entity);
    } catch (error) {
      BookingRepository.handleError(error);
    }
  }

  async createAndSaveOrFail(entityLike: DeepPartial<Booking>) {
    const booking = this.create(entityLike);
    return this.saveOrFail(booking);
  }

  async getOneOrFail(options?: FindOneOptions<Booking>) {
    try {
      return await this.findOneOrFail(options);
    } catch (error) {
      BookingRepository.handleError(error);
    }
  }

  async getSumOfReturnedBookings(userId: string) {
    const { sum } = await this.createQueryBuilder('booking')
      .select('SUM(booking.priceTotal)', 'sum')
      .where('booking.userId = :userId', { userId })
      .andWhere('booking.returnedAt IS NOT NULL')
      .getRawOne<{ sum: string }>();

    return Number(sum);
  }
}
