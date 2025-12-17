import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as entities from '@realestate/database';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'realestate',
    password: process.env.DB_PASSWORD || 'realestate_secret',
    database: process.env.DB_NAME || 'realestate_db',
    entities: [
      entities.User,
      entities.Role,
      entities.UserRole,
      entities.Agent,
      entities.AdminUnit,
      entities.PropertyType,
      entities.Listing,
      entities.Lead,
      entities.Deal,
    ],
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  }),
);
