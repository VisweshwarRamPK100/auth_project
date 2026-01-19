import { User } from '../../domain/entities/User';
import { UserResponseDTO } from '../dtos';

export class UserMapper {
    static toResponseDTO(user: User): UserResponseDTO {
        return new UserResponseDTO({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }

    static toDomain(data: any): User {
        return new User(
            data.id,
            data.email,
            data.password,
            data.firstName,
            data.lastName,
            data.isActive,
            data.isMfaEnabled,
            data.mfaSecret,
            data.createdAt,
            data.updatedAt,
            data.resetPasswordToken,
            data.resetPasswordExpires
        );
    }
}
