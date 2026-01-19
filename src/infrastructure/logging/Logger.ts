import { Environment } from '../config/Environment';

export enum LogLevel {
    ERROR = 'ERROR',
    WARN = 'WARN',
    INFO = 'INFO',
    DEBUG = 'DEBUG',
}

export class Logger {
    private static formatMessage(level: LogLevel, message: string, meta?: any): string {
        const timestamp = new Date().toISOString();
        const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
        return `[${timestamp}] [${level}] ${message}${metaStr}`;
    }

    static error(message: string, meta?: any): void {
        console.error(this.formatMessage(LogLevel.ERROR, message, meta));
    }

    static warn(message: string, meta?: any): void {
        console.warn(this.formatMessage(LogLevel.WARN, message, meta));
    }

    static info(message: string, meta?: any): void {
        console.log(this.formatMessage(LogLevel.INFO, message, meta));
    }

    static debug(message: string, meta?: any): void {
        if (Environment.NODE_ENV === 'development') {
            console.log(this.formatMessage(LogLevel.DEBUG, message, meta));
        }
    }
}
