import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validationMiddleware } from '../middleware/validationMiddleware';
import { 
    RegisterUserDTO, 
    LoginUserDTO, 
    RefreshTokenDTO, 
    VerifyMfaDTO,
    RequestPasswordResetDTO,
    ResetPasswordDTO 
} from '../../../application/dtos';

export function createAuthRoutes(authController: AuthController): Router {
    const router = Router();

    router.post(
        '/register',
        validationMiddleware(RegisterUserDTO),
        authController.register
    );

    router.post(
        '/login',
        validationMiddleware(LoginUserDTO),
        authController.login
    );

    router.post(
        '/refresh',
        validationMiddleware(RefreshTokenDTO),
        authController.refresh
    );

    router.post(
        '/verify-mfa',
        validationMiddleware(VerifyMfaDTO),
        authController.verifyMfa
    );

    router.post(
        '/forgot-password',
        validationMiddleware(RequestPasswordResetDTO),
        authController.forgotPassword
    );

    router.post(
        '/reset-password',
        validationMiddleware(ResetPasswordDTO),
        authController.resetPassword
    );

    router.post('/logout', authController.logout);

    return router;
}


