import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { RegisterUserDTO, AuthResponseDTO } from '../dtos';
import { IPasswordHashService, ITokenService } from '../interfaces/IServices';
import { UserMapper } from '../mappers/UserMapper';
import { v4 as uuidv4 } from 'uuid';

export class RegisterUserUseCase {
    constructor(
        private userRepository: IUserRepository,
        private passwordHashService: IPasswordHashService,
        private tokenService: ITokenService
    ) { }

    async execute(dto: RegisterUserDTO): Promise<AuthResponseDTO> {
        // Check if user already exists
        const existingUser = await this.userRepository.findByEmail(dto.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await this.passwordHashService.hash(dto.password);

        // Create user entity
        const user = new User(
            uuidv4(),
            dto.email,
            hashedPassword,
            dto.firstName,
            dto.lastName,
            true,
            false,
            undefined,
            new Date(),
            new Date()
        );

        // Save user
        const savedUser = await this.userRepository.create(user);

        // Generate tokens
        const accessToken = this.tokenService.generateAccessToken(savedUser.id, savedUser.email);
        const refreshToken = this.tokenService.generateRefreshToken(savedUser.id, savedUser.email);

        // Map to response DTO
        const userResponse = UserMapper.toResponseDTO(savedUser);

        return new AuthResponseDTO(userResponse, accessToken, refreshToken);
    }
}
