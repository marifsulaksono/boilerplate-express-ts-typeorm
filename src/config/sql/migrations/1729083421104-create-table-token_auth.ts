import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableTokenAuth1729083421104 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS token_auth(
            user_id uuid NOT NULL,
            refresh_token TEXT NOT NULL,
            ip_address varchar NOT NULL,
            unique(user_id)
        )`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE IF EXISTS token_auth')
    }

}
