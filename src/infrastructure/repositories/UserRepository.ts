import { Repository } from 'typeorm';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { UserModel } from '../database/models/UserModel';
import { AppDataSource } from '../database/DatabaseConnection';

export class UserRepository implements IUserRepository {
    private repository: Repository<UserModel>;

    constructor() {
        this.repository = AppDataSource.getRepository(UserModel);
    }

    async create(user: User): Promise<User> {
        const userModel = this.toModel(user);
        const savedModel = await this.repository.save(userModel);
        return this.toDomain(savedModel);
    }

    async findById(id: string): Promise<User | null> {
        const userModel = await this.repository.findOne({ where: { id } });
        return userModel ? this.toDomain(userModel) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const userModel = await this.repository.findOne({ where: { email } });
        return userModel ? this.toDomain(userModel) : null;
    }

    async update(user: User): Promise<User> {
        const userModel = this.toModel(user);
        const updatedModel = await this.repository.save(userModel);
        return this.toDomain(updatedModel);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async existsByEmail(email: string): Promise<boolean> {
        const count = await this.repository.count({ where: { email } });
        return count > 0;
    }

    async findByResetToken(token: string): Promise<User | null> {
        const userModel = await this.repository.findOne({ where: { resetPasswordToken: token } });
        return userModel ? this.toDomain(userModel) : null;
    }

    async findAll(): Promise<User[]> {
        const userModels = await this.repository.find();
        return userModels.map(model => this.toDomain(model));
    }

    // Mapper methods
    private toDomain(model: UserModel): User {
        return new User(
            model.id,
            model.email,
            model.password,
            model.firstName,
            model.lastName,
            model.isActive,
            model.isMfaEnabled,
            model.mfaSecret,
            model.createdAt,
            model.updatedAt,
            model.resetPasswordToken,
            model.resetPasswordExpires
        );
    }

    private toModel(user: User): UserModel {
        const model = new UserModel();
        model.id = user.id;
        model.email = user.email;
        model.password = user.password;
        model.firstName = user.firstName;
        model.lastName = user.lastName;
        model.isActive = user.isActive;
        model.isMfaEnabled = user.isMfaEnabled;
        model.mfaSecret = user.mfaSecret;
        model.resetPasswordToken = user.resetPasswordToken;
        model.resetPasswordExpires = user.resetPasswordExpires;
        model.createdAt = user.createdAt;
        model.updatedAt = user.updatedAt;
        return model;
    }
}
