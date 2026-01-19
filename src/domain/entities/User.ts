export class User {
    constructor(
        public readonly id: string,
        public email: string,
        public password: string,
        public firstName: string,
        public lastName: string,
        public isActive: boolean = true,
        public isMfaEnabled: boolean = false,
        public mfaSecret?: string,
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date(),
        public resetPasswordToken?: string | null,
        public resetPasswordExpires?: Date | null
    ) { }

    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    // Domain method to check if password matches
    async comparePassword(candidatePassword: string, passwordService: IPasswordService): Promise<boolean> {
        return passwordService.compare(candidatePassword, this.password);
    }

    // Update user information
    updateProfile(firstName?: string, lastName?: string): void {
        if (firstName) this.firstName = firstName;
        if (lastName) this.lastName = lastName;
        this.updatedAt = new Date();
    }

    // Deactivate user account
    deactivate(): void {
        this.isActive = false;
        this.updatedAt = new Date();
    }

    // Activate user account
    activate(): void {
        this.isActive = true;
        this.updatedAt = new Date();
    }

    // Update password
    updatePassword(newPassword: string): void {
        this.password = newPassword;
        this.updatedAt = new Date();
    }
}

// Interface that domain layer expects (defined in domain but implemented in infrastructure)
export interface IPasswordService {
    compare(candidatePassword: string, hashedPassword: string): Promise<boolean>;
}
