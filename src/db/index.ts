import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL || 'mysql://root:rootpassword@127.0.0.1:3306/vibedb';

const poolConnection = mysql.createPool(databaseUrl);

export const db = drizzle(poolConnection, { schema, mode: 'default' });
export * from './schema';
