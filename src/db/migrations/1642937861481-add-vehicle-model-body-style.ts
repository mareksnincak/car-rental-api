import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVehicleModelBodyStyle1642937861481
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner) {
    await queryRunner.query(
      'ALTER TABLE vehicle_models ADD COLUMN body_style varchar NOT NULL;',
    );
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.query(
      'ALTER TABLE vehicle_models DROP COLUMN body_style;',
    );
  }
}
