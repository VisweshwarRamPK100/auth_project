import bcrypt from 'bcrypt';
import { IPasswordHashService } from '../../application/interfaces/IServices';
import { Environment } from '../config/Environment';

export class PasswordService implements IPasswordHashService {
    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, Environment.BCRYPT_SALT_ROUNDS);
    }

    async compare(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}
