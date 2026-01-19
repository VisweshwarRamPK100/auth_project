import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { AuthResponseDTO, UserResponseDTO } from '../dtos';
import { ITokenService, IPasswordHashService } from '../interfaces/IServices';
import { IMfaService } from '../interfaces/IMfaService';
import { UserMapper } from '../mappers/UserMapper';

export class VerifyMfaUseCase {
    constructor(
        private userRepository: IUserRepository,
        private tokenService: ITokenService,
        private mfaService: IMfaService
    ) { }

    async execute(token: string, code: string): Promise<AuthResponseDTO> {
        // Verify MFA token
        const payload = this.mfaService.verifyMfaToken(token);

        // Find user
        const user = await this.userRepository.findById(payload.userId);
        if (!user || !user.isMfaEnabled || !user.mfaSecret) {
            throw new Error('Invalid MFA request');
        }

        // Verify code
        const isCodeValid = this.mfaService.verifyCode(code, user.mfaSecret);
        if (!isCodeValid) {
            throw new Error('Invalid MFA code');
        }

        // Generate final tokens
        const accessToken = this.tokenService.generateAccessToken(user.id, user.email);
        const refreshToken = this.tokenService.generateRefreshToken(user.id, user.email);

        // Clear secret after successful verification (if using one-time codes)
        // user.mfaSecret = undefined; 
        // await this.userRepository.update(user);

        const userResponse = UserMapper.toResponseDTO(user);
        return new AuthResponseDTO(userResponse, accessToken, refreshToken);
    }
}
