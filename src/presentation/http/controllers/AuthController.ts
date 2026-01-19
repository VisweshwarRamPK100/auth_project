import { Request, Response, NextFunction } from 'express';
import { RegisterUserUseCase } from '../../../application/use-cases/RegisterUserUseCase';
import { LoginUserUseCase } from '../../../application/use-cases/LoginUserUseCase';
import { RefreshTokenUseCase } from '../../../application/use-cases/RefreshTokenUseCase';
import { VerifyMfaUseCase } from '../../../application/use-cases/VerifyMfaUseCase';
import { RequestPasswordResetUseCase } from '../../../application/use-cases/RequestPasswordResetUseCase';
import { ResetPasswordUseCase } from '../../../application/use-cases/ResetPasswordUseCase';
import { 
    RegisterUserDTO, 
    LoginUserDTO, 
    RefreshTokenDTO, 
    VerifyMfaDTO,
    RequestPasswordResetDTO,
    ResetPasswordDTO 
} from '../../../application/dtos';
import { ConflictError, UnauthorizedError } from '../../../infrastructure/errors/AppError';
import { TokenBlacklistService } from '../../../infrastructure/services/TokenBlacklistService';

const tokenBlacklistService = TokenBlacklistService.getInstance();

export class AuthController {
    constructor(
        private registerUserUseCase: RegisterUserUseCase,
        private loginUserUseCase: LoginUserUseCase,
        private refreshTokenUseCase: RefreshTokenUseCase,
        private verifyMfaUseCase: VerifyMfaUseCase,
        private requestPasswordResetUseCase: RequestPasswordResetUseCase,
        private resetPasswordUseCase: ResetPasswordUseCase
    ) { }

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto: RegisterUserDTO = req.body;
            const result = await this.registerUserUseCase.execute(dto);

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: result,
            });
        } catch (error: any) {
            if (error.message.includes('already exists')) {
                return next(new ConflictError(error.message));
            }
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto: LoginUserDTO = req.body;
            const result = await this.loginUserUseCase.execute(dto);

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: result,
            });
        } catch (error: any) {
            if (error.message.includes('Invalid') || error.message.includes('deactivated')) {
                return next(new UnauthorizedError(error.message));
            }
            next(error);
        }
    };

    refresh = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto: RefreshTokenDTO = req.body;
            const result = await this.refreshTokenUseCase.execute(dto.refreshToken);

            res.status(200).json({
                success: true,
                message: 'Token refreshed successfully',
                data: result,
            });
        } catch (error: any) {
            if (error.message.includes('Invalid') || error.message.includes('expired')) {
                return next(new UnauthorizedError(error.message));
            }
            next(error);
        }
    };

    verifyMfa = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto: VerifyMfaDTO = req.body;
            const result = await this.verifyMfaUseCase.execute(dto.token, dto.code);

            res.status(200).json({
                success: true,
                message: 'MFA verification successful',
                data: result,
            });
        } catch (error: any) {
            if (error.message.includes('Invalid') || error.message.includes('expired')) {
                return next(new UnauthorizedError(error.message));
            }
            next(error);
        }
    };

    logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get token from Authorization header
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.substring(7);
                // Add token to blacklist
                tokenBlacklistService.addToBlacklist(token);
            }

            res.status(200).json({
                success: true,
                message: 'Logout successful',
            });
        } catch (error) {
            next(error);
        }
    };

    forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto: RequestPasswordResetDTO = req.body;
            await this.requestPasswordResetUseCase.execute(dto.email);

            res.status(200).json({
                success: true,
                message: 'If the email exists, a password reset link has been sent.',
            });
        } catch (error) {
            next(error);
        }
    };

    resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto: ResetPasswordDTO = req.body;
            await this.resetPasswordUseCase.execute(dto.token, dto.password);

            res.status(200).json({
                success: true,
                message: 'Password has been reset successfully.',
            });
        } catch (error: any) {
            if (error.message.includes('Invalid') || error.message.includes('expired')) {
                return next(new UnauthorizedError(error.message));
            }
            next(error);
        }
    };
}
