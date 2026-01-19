import dotenv from 'dotenv';

dotenv.config();

export class Environment {
    // Server configuration
    static readonly PORT = process.env.PORT || 3000;
    static readonly NODE_ENV = process.env.NODE_ENV || 'development';

    // Database configuration
    static readonly DB_HOST = process.env.DB_HOST || 'localhost';
    static readonly DB_PORT = parseInt(process.env.DB_PORT || '5432', 10);
    static readonly DB_USERNAME = process.env.DB_USERNAME || 'postgres';
    static readonly DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';
    static readonly DB_DATABASE = process.env.DB_DATABASE || 'auth_service';

    // JWT configuration
    static readonly JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'default-access-secret';
    static readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';
    static readonly JWT_ACCESS_EXPIRATION = process.env.JWT_ACCESS_EXPIRATION || '15m';
    static readonly JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || '7d';

    // Security configuration
    static readonly BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

    // SMTP configuration
    static readonly SMTP_HOST = process.env.SMTP_HOST || 'smtp.ethereal.email';
    static readonly SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
    static readonly SMTP_USER = process.env.SMTP_USER || '';
    static readonly SMTP_PASS = process.env.SMTP_PASS || '';
    static readonly SMTP_FROM = process.env.SMTP_FROM || '"Auth Service" <no-reply@authservice.com>';

    // CORS configuration
    static readonly ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
        : (this.NODE_ENV === 'production' ? [] : ['http://localhost:3000']);

    static validate(): void {
        // Validate JWT secrets
        const minSecretLength = 32;
        
        if (this.NODE_ENV === 'production') {
            if (this.JWT_ACCESS_SECRET === 'default-access-secret') {
                throw new Error('JWT_ACCESS_SECRET must be set in production');
            }
            if (this.JWT_REFRESH_SECRET === 'default-refresh-secret') {
                throw new Error('JWT_REFRESH_SECRET must be set in production');
            }
            if (this.JWT_ACCESS_SECRET.length < minSecretLength) {
                throw new Error(`JWT_ACCESS_SECRET must be at least ${minSecretLength} characters in production`);
            }
            if (this.JWT_REFRESH_SECRET.length < minSecretLength) {
                throw new Error(`JWT_REFRESH_SECRET must be at least ${minSecretLength} characters in production`);
            }
            if (this.ALLOWED_ORIGINS.length === 0) {
                throw new Error('ALLOWED_ORIGINS must be set in production');
            }
        } else {
            // Warn in development if secrets are weak
            if (this.JWT_ACCESS_SECRET.length < minSecretLength) {
                console.warn(`Warning: JWT_ACCESS_SECRET should be at least ${minSecretLength} characters for better security`);
            }
            if (this.JWT_REFRESH_SECRET.length < minSecretLength) {
                console.warn(`Warning: JWT_REFRESH_SECRET should be at least ${minSecretLength} characters for better security`);
            }
        }
    }
}
