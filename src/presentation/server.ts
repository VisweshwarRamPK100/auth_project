import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import 'reflect-metadata';
import { createAuthRoutes } from './http/routes/authRoutes';
import { createUserRoutes } from './http/routes/userRoutes';
import { errorMiddleware } from './http/middleware/errorMiddleware';
import { AuthController } from './http/controllers/AuthController';
import { UserController } from './http/controllers/UserController';
import { RegisterUserUseCase } from '../application/use-cases/RegisterUserUseCase';
import { LoginUserUseCase } from '../application/use-cases/LoginUserUseCase';
import { RefreshTokenUseCase } from '../application/use-cases/RefreshTokenUseCase';
import { VerifyMfaUseCase } from '../application/use-cases/VerifyMfaUseCase';
import { RequestPasswordResetUseCase } from '../application/use-cases/RequestPasswordResetUseCase';
import { ResetPasswordUseCase } from '../application/use-cases/ResetPasswordUseCase';
import { GetUserProfileUseCase } from '../application/use-cases/GetUserProfileUseCase';
import { UpdateUserProfileUseCase } from '../application/use-cases/UpdateUserProfileUseCase';
import { UserRepository } from '../infrastructure/repositories/UserRepository';
import { PasswordService } from '../infrastructure/services/PasswordService';
import { JwtService } from '../infrastructure/services/JwtService';
import { MfaService } from '../infrastructure/services/MfaService';
import { NodemailerService } from '../infrastructure/services/NodemailerService';
import { Environment } from '../infrastructure/config/Environment';
import { Logger } from '../infrastructure/logging/Logger';

export function createServer(): Application {
    const app = express();

    // Security headers with Helmet
    app.use(helmet());

    // CORS configuration with specific allowed origins
    app.use(cors({
        origin: Environment.ALLOWED_ORIGINS,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    // Request size limits to prevent DoS attacks
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Rate limiting for authentication endpoints
    const authRateLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 5 requests per windowMs
        message: {
            success: false,
            message: 'Too many authentication attempts, please try again later.',
        },
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    });

    // General rate limiter for all routes
    const generalRateLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
        standardHeaders: true,
        legacyHeaders: false,
    });

    // Apply general rate limiting to all routes
    app.use(generalRateLimiter);

    // Request logging
    app.use((req, res, next) => {
        Logger.info(`${req.method} ${req.path}`);
        next();
    });

    // Dependency injection
    const userRepository = new UserRepository();
    const passwordService = new PasswordService();
    const jwtService = new JwtService();
    const mfaService = new MfaService();
    const emailService = new NodemailerService();

    // Initialize use cases
    const registerUserUseCase = new RegisterUserUseCase(
        userRepository,
        passwordService,
        jwtService
    );
    const loginUserUseCase = new LoginUserUseCase(
        userRepository,
        passwordService,
        jwtService,
        mfaService,
        emailService
    );
    const verifyMfaUseCase = new VerifyMfaUseCase(
        userRepository,
        jwtService,
        mfaService
    );
    const refreshTokenUseCase = new RefreshTokenUseCase(jwtService);
    const requestPasswordResetUseCase = new RequestPasswordResetUseCase(userRepository, emailService);
    const resetPasswordUseCase = new ResetPasswordUseCase(userRepository, passwordService);
    const getUserProfileUseCase = new GetUserProfileUseCase(userRepository);
    const updateUserProfileUseCase = new UpdateUserProfileUseCase(userRepository);

    // Initialize controllers
    const authController = new AuthController(
        registerUserUseCase,
        loginUserUseCase,
        refreshTokenUseCase,
        verifyMfaUseCase,
        requestPasswordResetUseCase,
        resetPasswordUseCase
    );
    const userController = new UserController(
        getUserProfileUseCase,
        updateUserProfileUseCase
    );

    // Health check
    app.get('/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // Routes
    // Apply stricter rate limiting to auth routes
    app.use('/api/auth', authRateLimiter, createAuthRoutes(authController));
    app.use('/api/users', createUserRoutes(userController));

    // 404 handler
    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: 'Route not found',
        });
    });

    // Error handling middleware (must be last)
    app.use(errorMiddleware);

    return app;
}
