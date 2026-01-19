import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterUserDTO {
    @IsEmail({}, { message: 'Invalid email format' })
    email!: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(100, { message: 'Password is too long' })
    password!: string;

    @IsString()
    @MinLength(2, { message: 'First name must be at least 2 characters long' })
    @MaxLength(50, { message: 'First name is too long' })
    firstName!: string;

    @IsString()
    @MinLength(2, { message: 'Last name must be at least 2 characters long' })
    @MaxLength(50, { message: 'Last name is too long' })
    lastName!: string;
}

export class LoginUserDTO {
    @IsEmail({}, { message: 'Invalid email format' })
    email!: string;

    @IsString()
    @MinLength(1, { message: 'Password is required' })
    password!: string;
}

export class UpdateUserDTO {
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    firstName?: string;

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    lastName?: string;
}

export class RefreshTokenDTO {
    @IsString()
    refreshToken!: string;
}

export class VerifyMfaDTO {
    @IsString()
    token!: string;

    @IsString()
    @MinLength(6)
    @MaxLength(6)
    code!: string;
}

// Request password reset DTO
export class RequestPasswordResetDTO {
    @IsEmail({}, { message: 'Invalid email format' })
    email!: string;
}

// Reset password DTO
export class ResetPasswordDTO {
    @IsString()
    token!: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(100, { message: 'Password is too long' })
    password!: string;
}

// Response DTOs
export class UserResponseDTO {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: Partial<UserResponseDTO>) {
        this.id = data.id!;
        this.email = data.email!;
        this.firstName = data.firstName!;
        this.lastName = data.lastName!;
        this.fullName = data.fullName!;
        this.isActive = data.isActive!;
        this.createdAt = data.createdAt!;
        this.updatedAt = data.updatedAt!;
    }
}

export class AuthResponseDTO {
    user?: UserResponseDTO;
    accessToken?: string;
    refreshToken?: string;
    requiresMfa?: boolean;
    mfaToken?: string;

    constructor(
        user?: UserResponseDTO,
        accessToken?: string,
        refreshToken?: string,
        requiresMfa?: boolean,
        mfaToken?: string
    ) {
        this.user = user;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.requiresMfa = requiresMfa;
        this.mfaToken = mfaToken;
    }
}
