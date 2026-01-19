import jwt from 'jsonwebtoken';
import { Environment } from '../config/Environment';

/**
 * TokenBlacklistService manages blacklisted JWT tokens.
 * 
 * For production with multiple instances, consider using Redis instead of in-memory storage.
 * This implementation uses an in-memory Map which is suitable for single-instance deployments.
 */
export class TokenBlacklistService {
    private static instance: TokenBlacklistService;
    private blacklistedTokens: Map<string, number> = new Map();

    private constructor() {
        // Clean up expired tokens every 5 minutes
        setInterval(() => this.cleanupExpiredTokens(), 5 * 60 * 1000);
    }

    /**
     * Get singleton instance
     */
    static getInstance(): TokenBlacklistService {
        if (!TokenBlacklistService.instance) {
            TokenBlacklistService.instance = new TokenBlacklistService();
        }
        return TokenBlacklistService.instance;
    }

    /**
     * Add a token to the blacklist
     * @param token - The JWT token to blacklist
     */
    addToBlacklist(token: string): void {
        try {
            // Decode token to get expiration time
            const decoded = jwt.decode(token) as jwt.JwtPayload | null;
            if (decoded && decoded.exp) {
                // Store token with its expiration timestamp
                this.blacklistedTokens.set(token, decoded.exp * 1000);
            } else {
                // If we can't decode, store with a default expiration (15 minutes from now)
                this.blacklistedTokens.set(token, Date.now() + 15 * 60 * 1000);
            }
        } catch (error) {
            // If token is invalid, still add it to blacklist with default expiration
            this.blacklistedTokens.set(token, Date.now() + 15 * 60 * 1000);
        }
    }

    /**
     * Check if a token is blacklisted
     * @param token - The JWT token to check
     * @returns true if token is blacklisted, false otherwise
     */
    isBlacklisted(token: string): boolean {
        const expiration = this.blacklistedTokens.get(token);
        if (!expiration) {
            return false;
        }

        // If token has expired, remove it and return false
        if (expiration < Date.now()) {
            this.blacklistedTokens.delete(token);
            return false;
        }

        return true;
    }

    /**
     * Remove expired tokens from the blacklist
     */
    private cleanupExpiredTokens(): void {
        const now = Date.now();
        for (const [token, expiration] of this.blacklistedTokens.entries()) {
            if (expiration < now) {
                this.blacklistedTokens.delete(token);
            }
        }
    }

    /**
     * Clear all tokens from blacklist (useful for testing)
     */
    clear(): void {
        this.blacklistedTokens.clear();
    }
}

