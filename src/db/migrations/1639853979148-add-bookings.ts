import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableExclusion,
  TableForeignKey,
} from 'typeorm';

export class AddBookings1639853979148 implements MigrationInterface {
  async up(queryRunner: QueryRunner) {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "btree_gist";');

    await queryRunner.createTable(
      new Table({
        name: 'bookings',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'date_range',
            type: 'tstzrange',
          },
          {
            name: 'vehicle_id',
            type: 'uuid',
          },
          {
            name: 'price',
            type: 'decimal(10,2)',
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'NOW()',
          },
          {
            name: 'updated_at',
            type: 'timestamp with time zone',
            default: 'NOW()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'bookings',
      new TableForeignKey({
        columnNames: ['vehicle_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'vehicles',
        onDelete: 'RESTRICT',
      }),
    );

    /**
     * We may need to add buffer later https://www.cybertec-postgresql.com/en/postgresql-exclude-beyond-unique/
     */
    await queryRunner.createExclusionConstraint(
      'bookings',
      new TableExclusion({
        name: 'overlapping_bookings_constraint',
        expression: 'USING GIST (vehicle_id WITH =, date_range WITH &&)',
      }),
    );
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.query('DROP TABLE bookings;');
  }
}
