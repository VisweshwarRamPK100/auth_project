import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../../../infrastructure/services/JwtService';
import { TokenBlacklistService } from '../../../infrastructure/services/TokenBlacklistService';
import { UnauthorizedError } from '../../../infrastructure/errors/AppError';

const jwtService = new JwtService();
const tokenBlacklistService = TokenBlacklistService.getInstance();

// Extend Express Request type to include user data
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                email: string;
            };
        }
    }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('No token provided');
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Check if token is blacklisted
        if (tokenBlacklistService.isBlacklisted(token)) {
            throw new UnauthorizedError('Token has been revoked');
        }

        const payload = jwtService.verifyAccessToken(token);

        req.user = {
            userId: payload.userId,
            email: payload.email,
        };

        next();
    } catch (error) {
        next(new UnauthorizedError('Invalid or expired token'));
    }
}
