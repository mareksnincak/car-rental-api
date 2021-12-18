import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class AddBookings1639853979148 implements MigrationInterface {
  async up(queryRunner: QueryRunner) {
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
            name: 'from',
            type: 'timestamp with time zone',
          },
          {
            name: 'to',
            type: 'timestamp with time zone',
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
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.query('DROP TABLE bookings;');
  }
}
