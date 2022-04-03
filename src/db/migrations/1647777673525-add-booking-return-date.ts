import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBookingReturnDate1647777673525 implements MigrationInterface {
  async up(queryRunner: QueryRunner) {
    await queryRunner.query(
      'ALTER TABLE bookings ADD COLUMN returned_at timestamp with time zone;',
    );
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.query('ALTER TABLE bookings DROP COLUMN returned_at;');
  }
}
