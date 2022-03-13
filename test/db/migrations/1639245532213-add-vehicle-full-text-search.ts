import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVehicleFullTextSearch1639245532213
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner) {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_vehicle_models_search_vector()
      RETURNS trigger AS $$
      BEGIN
        NEW.search_vector := to_tsvector(
          'simple', unaccent(NEW.make || ' ' || NEW.model)
        );
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_vehicle_models_search_vector_trg
      BEFORE INSERT OR UPDATE
      ON vehicle_models
      FOR EACH ROW EXECUTE PROCEDURE update_vehicle_models_search_vector();
    `);

    await queryRunner.query(`
      CREATE INDEX vehicle_models_search_vector_idx ON vehicle_models USING GIN(search_vector);
    `);
  }

  async down(_queryRunner: QueryRunner) {
    // not needed
  }
}
