import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class AddVehicles1639245532213 implements MigrationInterface {
  async up(queryRunner: QueryRunner) {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "unaccent";');

    await queryRunner.createTable(
      new Table({
        name: 'vehicle_models',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'make',
            type: 'varchar',
          },
          {
            name: 'model',
            type: 'varchar',
          },
          {
            name: 'fuel',
            type: 'varchar',
          },
          {
            name: 'transmission',
            type: 'varchar',
          },
          {
            name: 'seats',
            type: 'smallint',
          },
          {
            name: 'doors',
            type: 'smallint',
          },
          {
            name: 'power',
            type: 'decimal(6,2)',
          },
          {
            name: 'search_vector',
            type: 'tsvector',
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

    await queryRunner.createTable(
      new Table({
        name: 'vehicles',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'vin',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'vehicle_model_id',
            type: 'uuid',
          },
          {
            name: 'year',
            type: 'smallint',
          },
          {
            name: 'mileage',
            type: 'integer',
          },
          {
            name: 'color',
            type: 'varchar',
          },
          {
            name: 'purchase_price',
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
      'vehicles',
      new TableForeignKey({
        columnNames: ['vehicle_model_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'vehicle_models',
        onDelete: 'CASCADE',
      }),
    );

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

  async down(queryRunner: QueryRunner) {
    await queryRunner.query('DROP TABLE vehicles;');
    await queryRunner.query('DROP TABLE vehicle_models;');
    await queryRunner.query(
      'DROP FUNCTION update_vehicle_models_search_vector();',
    );
  }
}
