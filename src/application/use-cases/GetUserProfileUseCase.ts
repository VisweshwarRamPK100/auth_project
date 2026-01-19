import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserResponseDTO } from '../dtos';
import { UserMapper } from '../mappers/UserMapper';

export class GetUserProfileUseCase {
    constructor(private userRepository: IUserRepository) { }

    async execute(userId: string): Promise<UserResponseDTO> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        return UserMapper.toResponseDTO(user);
    }
}
