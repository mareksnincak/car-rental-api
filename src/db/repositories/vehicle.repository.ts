import {
  EntityNotFoundError,
  EntityRepository,
  FindOneOptions,
  Repository,
} from 'typeorm';

import { Vehicle } from '@entities/vehicle.entity';
import DbUtils from '@db/db.utils';
import { NotFoundAppException } from '@common/exceptions/not-found.exception';
import { TSearchParams } from '@vehicles/vehicle.type';
import { ESortBy } from '@vehicles/vehicle.constants';
import { Booking } from '../entities/booking.entity';

@EntityRepository(Vehicle)
export class VehicleRepository extends Repository<Vehicle> {
  static handleError(error: unknown) {
    if (error instanceof EntityNotFoundError) {
      throw new NotFoundAppException('Vehicle', error.message);
    }

    throw error;
  }

  async search(searchParams: TSearchParams) {
    const {
      page,
      pageSize,
      sortBy,
      sortDirection,
      query,
      fromDate,
      toDate,
      seatsMin,
      seatsMax,
      powerMin,
      powerMax,
      transmissions,
      fuels,
      bodyStyles,
    } = searchParams;

    const qb = this.createQueryBuilder('vehicle')
      .innerJoinAndSelect('vehicle.vehicleModel', 'vehicleModel')
      .where('vehicleModel.transmission IN (:...transmissions)', {
        transmissions,
      })
      .andWhere('vehicleModel.fuel IN (:...fuels)', { fuels })
      .andWhere('vehicleModel.bodyStyle IN (:...bodyStyles)', { bodyStyles });

    const tsQuery = DbUtils.stringToPartialTsQuery(query);
    if (tsQuery) {
      qb.andWhere(
        "vehicleModel.searchVector @@ to_tsquery('simple', unaccent(:tsQuery))",
        { tsQuery },
      );
    }

    if (fromDate && toDate) {
      qb.andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .from(Booking, 'booking')
          .where('booking.vehicleId = vehicle.id')
          .andWhere('booking.returnedAt IS NULL')
          .andWhere(
            '(booking.fromDate, booking.toDate) OVERLAPS (:fromDate, :toDate)',
            {
              fromDate,
              toDate,
            },
          )
          .getQuery();

        return `NOT EXISTS ${subQuery}`;
      });
    }

    qb.andWhere('vehicleModel.seats >= :seatsMin', { seatsMin });
    if (seatsMax) {
      qb.andWhere('vehicleModel.seats <= :seatsMax', { seatsMax });
    }

    qb.andWhere('vehicleModel.power >= :powerMin', { powerMin });
    if (powerMax) {
      qb.andWhere('vehicleModel.power <= :powerMax', { powerMax });
    }

    return qb
      .orderBy(ESortBy[sortBy], sortDirection)
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
  }

  async getOneOrFail(options?: FindOneOptions<Vehicle>) {
    try {
      return await this.findOneOrFail(options);
    } catch (error) {
      VehicleRepository.handleError(error);
    }
  }
}
