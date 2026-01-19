import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IEmailService } from '../interfaces/IEmailService';
import crypto from 'crypto';
import { AppError } from '../../infrastructure/errors/AppError';

export class RequestPasswordResetUseCase {
    constructor(
        private userRepository: IUserRepository,
        private emailService: IEmailService
    ) {}

    async execute(email: string): Promise<void> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            // We should not reveal if the user exists or not for security reasons
            // But we might want to log it or simulate delay
            return;
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // Hash it before saving to database (optional but recommended, here we save plain for simplicity based on plan or do we?)
        // The plan didn't specify hashing the token in DB, but User.ts has comparators. 
        // For simplicity and matching typical reset flows, we often save the token or a hash.
        // Let's safe the token itself as the plan implies "Finds user by token". 
        // If we hashed it, we couldn't find by token easily without separate lookup or storing the token in the URL.
        // Actually, standard is: URL has token. DB has hashed token. 
        // But for this complexity, let's store it directly as per plan implication "Finds user by token".
        // Wait, `User` entity modification I made added `resetPasswordToken` field.
        
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

        await this.userRepository.update(user);

        // Send email
        const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
        const message = `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n` +
            `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
            `${resetUrl}\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.\n`;

        await this.emailService.sendEmail(user.email, 'Password Reset Request', message);
    }
}
