import * as dotenv from 'dotenv';
import { join } from "path";
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { User } from '../../app/module/users/users.model';

dotenv.config();

const options: DataSourceOptions & SeederOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    logging: false,
    synchronize: false,
    entities: [User],
    migrations: [join(__dirname, '/migrations/**/*{.ts,.js}')],
    migrationsTableName: 'typeorm_migrations',
    migrationsRun: false,
    seeds: [join(__dirname, '/../..', '/seeders/**/*{.ts,.js}')],
    seedTracking: true,
}

export const AppDataSource = new DataSource(options);