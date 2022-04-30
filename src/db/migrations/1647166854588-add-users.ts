import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddUsers1647166854588 implements MigrationInterface {
  async up(queryRunner: QueryRunner) {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'api_key',
            type: 'varchar',
            isUnique: true,
            default: "encode(gen_random_bytes(32), 'hex')",
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

    await queryRunner.query(
      'ALTER TABLE bookings ADD COLUMN user_id uuid NOT NULL;',
    );

    await queryRunner.query(
      'ALTER TABLE bookings ADD CONSTRAINT user_id_fk FOREIGN KEY (user_id) REFERENCES users (id);',
    );
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.query('ALTER TABLE bookings DROP COLUMN user_id;');
    await queryRunner.query('DROP TABLE users;');
  }
}
