import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IPasswordHashService } from '../interfaces/IServices';
import { AppError } from '../../infrastructure/errors/AppError';

export class ResetPasswordUseCase {
    constructor(
        private userRepository: IUserRepository,
        private passwordHashService: IPasswordHashService
    ) {}

    async execute(token: string, newPassword: string): Promise<void> {
        const user = await this.userRepository.findByResetToken(token);

        if (!user) {
            throw new AppError('Invalid or expired password reset token', 400);
        }

        if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
            throw new AppError('Invalid or expired password reset token', 400);
        }

        // Hash new password
        const hashedPassword = await this.passwordHashService.hash(newPassword);

        // Update password and clear reset token
        user.updatePassword(hashedPassword);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await this.userRepository.update(user);
    }
}
