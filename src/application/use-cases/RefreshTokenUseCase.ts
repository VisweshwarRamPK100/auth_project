import { ITokenService } from '../interfaces/IServices';

export class RefreshTokenUseCase {
    constructor(private tokenService: ITokenService) { }

    async execute(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        try {
            // Verify refresh token
            const payload = this.tokenService.verifyRefreshToken(refreshToken);

            // Generate new access token
            const accessToken = this.tokenService.generateAccessToken(payload.userId, payload.email);

            // Generate new refresh token (token rotation for security)
            const newRefreshToken = this.tokenService.generateRefreshToken(payload.userId, payload.email);

            return { accessToken, refreshToken: newRefreshToken };
        } catch (error) {
            throw new Error('Invalid or expired refresh token');
        }
    }
}
