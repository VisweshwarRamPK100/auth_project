import { Request, Response, NextFunction } from 'express';
import { GetUserProfileUseCase } from '../../../application/use-cases/GetUserProfileUseCase';
import { UpdateUserProfileUseCase } from '../../../application/use-cases/UpdateUserProfileUseCase';
import { UpdateUserDTO } from '../../../application/dtos';
import { NotFoundError } from '../../../infrastructure/errors/AppError';

export class UserController {
    constructor(
        private getUserProfileUseCase: GetUserProfileUseCase,
        private updateUserProfileUseCase: UpdateUserProfileUseCase
    ) { }

    getProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.userId;
            const user = await this.getUserProfileUseCase.execute(userId);

            res.status(200).json({
                success: true,
                data: user,
            });
        } catch (error: any) {
            if (error.message.includes('not found')) {
                return next(new NotFoundError(error.message));
            }
            next(error);
        }
    };

    updateProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.userId;
            const dto: UpdateUserDTO = req.body;
            const user = await this.updateUserProfileUseCase.execute(userId, dto);

            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: user,
            });
        } catch (error: any) {
            if (error.message.includes('not found')) {
                return next(new NotFoundError(error.message));
            }
            next(error);
        }
    };
}
