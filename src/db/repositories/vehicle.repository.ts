import { EntityRepository, Repository } from 'typeorm';

import { Vehicle } from '@entities/vehicle.entity';
import { TSearchParams } from '@common/types/search.type';
import { stringToPartialTsQuery } from '@db/db.utils';

@EntityRepository(Vehicle)
export class VehicleRepository extends Repository<Vehicle> {
  async search({
    page,
    pageSize,
    sortBy,
    sortDirection,
    query,
  }: TSearchParams) {
    const qb = this.createQueryBuilder('vehicle').innerJoinAndSelect(
      'vehicle.vehicleModel',
      'vehicleModel',
    );

    const tsQuery = stringToPartialTsQuery(query);
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
}
