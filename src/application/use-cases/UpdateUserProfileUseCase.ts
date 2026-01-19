import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UpdateUserDTO, UserResponseDTO } from '../dtos';
import { UserMapper } from '../mappers/UserMapper';

export class UpdateUserProfileUseCase {
    constructor(private userRepository: IUserRepository) { }

    async execute(userId: string, dto: UpdateUserDTO): Promise<UserResponseDTO> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        // Update user profile
        user.updateProfile(dto.firstName, dto.lastName);

        // Save updated user
        const updatedUser = await this.userRepository.update(user);

        return UserMapper.toResponseDTO(updatedUser);
    }
}
