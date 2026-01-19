import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../infrastructure/errors/AppError';
import { Logger } from '../../../infrastructure/logging/Logger';
import { Environment } from '../../../infrastructure/config/Environment';

export function errorMiddleware(
    error: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Log error
    Logger.error('Error occurred', {
        message: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
    });

    // Handle AppError
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
            ...(Environment.NODE_ENV === 'development' && { stack: error.stack }),
        });
    }

    // Handle unknown errors
    return res.status(500).json({
        success: false,
        message: Environment.NODE_ENV === 'development'
            ? error.message
            : 'Internal server error',
        ...(Environment.NODE_ENV === 'development' && { stack: error.stack }),
    });
}
