import 'reflect-metadata';
import { createServer } from './presentation/server';
import { initializeDatabase } from './infrastructure/database/DatabaseConnection';
import { Environment } from './infrastructure/config/Environment';
import { Logger } from './infrastructure/logging/Logger';

async function start() {
    try {
        // Validate environment variables
        Environment.validate();
        Logger.info('Environment variables validated');

        // Initialize database
        await initializeDatabase();

        // Create and start server
        const app = createServer();
        const port = Environment.PORT;

        app.listen(port, () => {
            Logger.info(`🚀 Server is running on port ${port}`);
            Logger.info(`Environment: ${Environment.NODE_ENV}`);
            Logger.info(`Health check: http://localhost:${port}/health`);
        });
    } catch (error) {
        Logger.error('Failed to start server', error);
        process.exit(1);
    }
}

// Handle uncaught errors
process.on('uncaughtException', (error: Error) => {
    Logger.error('Uncaught Exception', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
    Logger.error('Unhandled Rejection', { reason, promise });
    process.exit(1);
});

start();
