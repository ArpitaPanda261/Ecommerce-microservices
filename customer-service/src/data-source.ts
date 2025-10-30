import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Customer } from './customer/customer.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? '127.0.0.1', // ✅ use IPv4 to avoid "::1" issues
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASS ?? 'Postgrespassword',
  database: process.env.DB_NAME ?? 'customer_service',
  entities: [Customer],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
