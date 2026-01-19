import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ValidationError } from '../../../infrastructure/errors/AppError';

export function validationMiddleware<T extends object>(type: new () => T) {
    return async  (req: Request, res: Response, next: NextFunction) => {
        const dto = plainToClass(type, req.body);
        const errors = await validate(dto);

        if (errors.length > 0) {
            const messages = errors.map(error =>
                Object.values(error.constraints || {}).join(', ')
            ).join('; ');

            return next(new ValidationError(messages));
        }

        req.body = dto;
        next();
    };
}
