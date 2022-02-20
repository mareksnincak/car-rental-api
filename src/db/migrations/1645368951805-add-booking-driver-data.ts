import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBookingDriverData1645368951805 implements MigrationInterface {
  async up(queryRunner: QueryRunner) {
    await queryRunner.query(`
      ALTER TABLE bookings
        ADD COLUMN driver_email varchar,
        ADD COLUMN driver_id_number varchar;
    `);

    await queryRunner.query(`
      UPDATE bookings
        SET driver_email = 'unknown',
            driver_id_number = 'unknown'
      WHERE 1=1;
    `);

    await queryRunner.query(`
      ALTER TABLE bookings
        ALTER COLUMN driver_email SET NOT NULL,
        ALTER COLUMN driver_id_number SET NOT NULL;
    `);
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.query(`
      ALTER TABLE bookings
        DROP COLUMN driver_email,
        DROP COLUMN driver_id_number;
    `);
  }
}
