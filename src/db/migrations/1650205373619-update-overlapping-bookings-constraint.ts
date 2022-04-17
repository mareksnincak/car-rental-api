import { MigrationInterface, QueryRunner, TableExclusion } from 'typeorm';

export class UpdateOverlappingBookingsConstraint1650205373619
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner) {
    await queryRunner.query(
      'ALTER TABLE bookings DROP CONSTRAINT overlapping_bookings_constraint',
    );

    await queryRunner.createExclusionConstraint(
      'bookings',
      new TableExclusion({
        name: 'overlapping_bookings_constraint',
        expression:
          "USING GIST (vehicle_id WITH =, tstzrange(from_date, to_date, '[)') WITH &&) WHERE (returned_at IS NULL)",
      }),
    );
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.query(
      'ALTER TABLE bookings DROP CONSTRAINT overlapping_bookings_constraint',
    );

    await queryRunner.createExclusionConstraint(
      'bookings',
      new TableExclusion({
        name: 'overlapping_bookings_constraint',
        expression:
          "USING GIST (vehicle_id WITH =, tstzrange(from_date, to_date, '[)') WITH &&)",
      }),
    );
  }
}
