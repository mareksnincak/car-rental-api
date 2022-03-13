import { MigrationInterface, QueryRunner, TableExclusion } from 'typeorm';

export class AddBookingOverlapConstraints1639853979148
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner) {
    await queryRunner.createExclusionConstraint(
      'bookings',
      new TableExclusion({
        name: 'overlapping_bookings_constraint',
        expression:
          "USING GIST (vehicle_id WITH =, tstzrange(from_date, to_date, '[)') WITH &&)",
      }),
    );

    await queryRunner.query(
      "CREATE INDEX date_range_idx ON bookings(tstzrange(from_date, to_date, '[)'));",
    );
  }

  async down(_queryRunner: QueryRunner) {
    // not needed
  }
}
