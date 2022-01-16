import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVehicleModelImageUrl1642341306962
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner) {
    await queryRunner.query(
      'ALTER TABLE vehicle_models ADD COLUMN image_url varchar NOT NULL;',
    );
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.query(
      'ALTER TABLE vehicle_models DROP COLUMN image_url;',
    );
  }
}
