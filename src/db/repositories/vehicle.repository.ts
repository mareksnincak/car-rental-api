import { EntityRepository, Repository } from 'typeorm';

import { Vehicle } from '@entities/vehicle.entity';
import { TSearchParams } from '@common/types/search.type';
import DbUtils from '@db/db.utils';

@EntityRepository(Vehicle)
export class VehicleRepository extends Repository<Vehicle> {
  async search(searchParams: TSearchParams) {
    const { page, pageSize, sortBy, sortDirection, query } = searchParams;

    const qb = this.createQueryBuilder('vehicle').innerJoinAndSelect(
      'vehicle.vehicleModel',
      'vehicleModel',
    );

    const tsQuery = DbUtils.stringToPartialTsQuery(query);
    if (tsQuery) {
      qb.andWhere(
        "vehicleModel.searchVector @@ to_tsquery('simple', unaccent(:tsQuery))",
        { tsQuery },
      );
    }

    return qb
      .orderBy(sortBy, sortDirection)
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
  }

  async getOneWithFutureBookingsOrFail(id: string) {
    return this.createQueryBuilder('vehicle')
      .innerJoinAndSelect('vehicle.vehicleModel', 'vehicleModel')
      .leftJoinAndSelect(
        'vehicle.bookings',
        'booking',
        'upper(booking.dateRange) >= NOW()',
      )
      .where('vehicle.id = :id', { id })
      .getOneOrFail();
  }
}
