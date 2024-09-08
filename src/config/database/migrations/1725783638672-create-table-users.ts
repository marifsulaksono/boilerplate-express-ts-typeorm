import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableUsers1725783638672 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS users(
                id BIGSERIAL PRIMARY KEY,
                name varchar(255) NOT NULL,
                email varchar(255) NOT NULL,
                password varchar NOT NULL,
                created_at timestamptz DEFAULT NOW() NOT NULL,
                updated_at timestamptz DEFAULT NOW() NOT NULL,
                deleted_at timestamptz NULL,
                unique(email)
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE IF EXISTS users');
    }

}
