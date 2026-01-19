import { User } from '../entities/User';

export interface IUserRepository {
    // Create a new user
    create(user: User): Promise<User>;

    // Find user by ID
    findById(id: string): Promise<User | null>;

    // Find user by email
    findByEmail(email: string): Promise<User | null>;

    // Update user
    update(user: User): Promise<User>;

    // Delete user
    delete(id: string): Promise<void>;

    // Check if email exists
    existsByEmail(email: string): Promise<boolean>;

    // Find user by reset token
    findByResetToken(token: string): Promise<User | null>;

    // Find all users (optional, for admin purposes)
    findAll(): Promise<User[]>;
}
