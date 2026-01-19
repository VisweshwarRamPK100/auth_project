export interface IPasswordHashService {
    hash(password: string): Promise<string>;
    compare(password: string, hashedPassword: string): Promise<boolean>;
}

export interface ITokenService {
    generateAccessToken(userId: string, email: string): string;
    generateRefreshToken(userId: string, email: string): string;
    verifyAccessToken(token: string): { userId: string; email: string };
    verifyRefreshToken(token: string): { userId: string; email: string };
}
