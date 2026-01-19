import { DataSource } from 'typeorm';
import { Environment } from '../config/Environment';
import { UserModel } from './models/UserModel';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: Environment.DB_HOST,
    port: Environment.DB_PORT,
    username: Environment.DB_USERNAME,
    password: Environment.DB_PASSWORD,
    database: Environment.DB_DATABASE,
    synchronize: Environment.NODE_ENV === 'development', // Auto-sync in dev, use migrations in prod
    logging: Environment.NODE_ENV === 'development',
    entities: [UserModel],
    subscribers: [],
    migrations: [],
});

export async function initializeDatabase(): Promise<void> {
    try {
        await AppDataSource.initialize();
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        throw error;
    }
}
