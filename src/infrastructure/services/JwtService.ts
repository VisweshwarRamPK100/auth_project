import jwt from 'jsonwebtoken';
import { ITokenService } from '../../application/interfaces/IServices';
import { Environment } from '../config/Environment';

interface TokenPayload {
    userId: string;
    email: string;
}

export class JwtService implements ITokenService {
    generateAccessToken(userId: string, email: string): string {
        const payload: TokenPayload = { userId, email };
        return jwt.sign(payload, Environment.JWT_ACCESS_SECRET, {
            expiresIn: Environment.JWT_ACCESS_EXPIRATION,
        } as jwt.SignOptions);
    }

    generateRefreshToken(userId: string, email: string): string {
        const payload: TokenPayload = { userId, email };
        return jwt.sign(payload, Environment.JWT_REFRESH_SECRET, {
            expiresIn: Environment.JWT_REFRESH_EXPIRATION,
        } as jwt.SignOptions);
    }

    verifyAccessToken(token: string): { userId: string; email: string } {
        try {
            const payload = jwt.verify(token, Environment.JWT_ACCESS_SECRET) as TokenPayload;
            return { userId: payload.userId, email: payload.email };
        } catch (error) {
            throw new Error('Invalid or expired access token');
        }
    }

    verifyRefreshToken(token: string): { userId: string; email: string } {
        try {
            const payload = jwt.verify(token, Environment.JWT_REFRESH_SECRET) as TokenPayload;
            return { userId: payload.userId, email: payload.email };
        } catch (error) {
            throw new Error('Invalid or expired refresh token');
        }
    }
}
