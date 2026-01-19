import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validationMiddleware } from '../middleware/validationMiddleware';
import { UpdateUserDTO } from '../../../application/dtos';

export function createUserRoutes(userController: UserController): Router {
    const router = Router();

    // All user routes require authentication
    router.use(authMiddleware);

    router.get('/profile', userController.getProfile);

    router.put(
        '/profile',
        validationMiddleware(UpdateUserDTO),
        userController.updateProfile
    );

    return router;
}
