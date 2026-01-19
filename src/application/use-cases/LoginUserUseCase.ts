import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { LoginUserDTO, AuthResponseDTO } from '../dtos';
import { IPasswordHashService, ITokenService } from '../interfaces/IServices';
import { IMfaService } from '../interfaces/IMfaService';
import { IEmailService } from '../interfaces/IEmailService';
import { UserMapper } from '../mappers/UserMapper';

export class LoginUserUseCase {
    constructor(
        private userRepository: IUserRepository,
        private passwordHashService: IPasswordHashService,
        private tokenService: ITokenService,
        private mfaService: IMfaService,
        private emailService: IEmailService
    ) { }

    async execute(dto: LoginUserDTO): Promise<AuthResponseDTO> {
        // Find user by email
        const user = await this.userRepository.findByEmail(dto.email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Check if user is active
        if (!user.isActive) {
            throw new Error('Account is deactivated');
        }

        // Verify password
        const isPasswordValid = await this.passwordHashService.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        // Check if MFA is enabled
        if (user.isMfaEnabled) {
            // Generate a code
            const code = this.mfaService.generateCode();
            
            // Save code as secret (in a real app, you might use a separate table or TOTP)
            user.mfaSecret = code;
            await this.userRepository.update(user);

            // Send MFA code via Email
            await this.emailService.sendEmail(
                user.email,
                'Your MFA Verification Code',
                `Your verification code is: ${code}. It will expire in 5 minutes.`,
                `<h1>MFA Verification</h1><p>Your verification code is: <strong>${code}</strong></p><p>It will expire in 5 minutes.</p>`
            );

            // Log the code for simulation (still helpful for dev)
            console.log(`[MFA] Sent code ${code} to user ${user.email}`);

            // Generate an MFA token
            const mfaToken = this.mfaService.generateMfaToken(user.id, user.email);

            return new AuthResponseDTO(undefined, undefined, undefined, true, mfaToken);
        }

        // Generate tokens
        const accessToken = this.tokenService.generateAccessToken(user.id, user.email);
        const refreshToken = this.tokenService.generateRefreshToken(user.id, user.email);

        // Map to response DTO
        const userResponse = UserMapper.toResponseDTO(user);

        return new AuthResponseDTO(userResponse, accessToken, refreshToken);
    }
}
