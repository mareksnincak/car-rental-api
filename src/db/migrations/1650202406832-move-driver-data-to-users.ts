import { MigrationInterface, QueryRunner } from 'typeorm';

export class MoveDriverDataToUsers1650202406832 implements MigrationInterface {
  async up(queryRunner: QueryRunner) {
    await queryRunner.query(`
      ALTER TABLE users
        ADD COLUMN first_name varchar,
        ADD COLUMN last_name varchar,
        ADD COLUMN date_of_birth timestamp with time zone;
    `);

    await queryRunner.query(`
      UPDATE users SET
        first_name='unknown',
        last_name='unknown',
        date_of_birth='1990-01-01T00:00:00.000Z';
    `);

    await queryRunner.query(`
      ALTER TABLE users
        ALTER COLUMN first_name SET NOT NULL,
        ALTER COLUMN last_name SET NOT NULL,
        ALTER COLUMN date_of_birth SET NOT NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE bookings
        DROP COLUMN driver_name,
        DROP COLUMN driver_age,
        DROP COLUMN driver_email,
        DROP COLUMN driver_id_number;
    `);
  }

  async down(_queryRunner: QueryRunner) {
    /**
     * Irreversible
     */
  }
}
