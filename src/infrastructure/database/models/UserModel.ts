import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class UserModel {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ unique: true, length: 255 })
    email!: string;

    @Column({ length: 255 })
    password!: string;

    @Column({ name: 'first_name', length: 100 })
    firstName!: string;

    @Column({ name: 'last_name', length: 100 })
    lastName!: string;

    @Column({ name: 'is_active', default: true })
    isActive!: boolean;

    @Column({ name: 'is_mfa_enabled', default: false })
    isMfaEnabled!: boolean;

    @Column({ name: 'mfa_secret', length: 255, nullable: true })
    mfaSecret?: string;

    @Column({ name: 'reset_password_token', type: 'varchar', length: 255, nullable: true })
    resetPasswordToken?: string | null;

    @Column({ name: 'reset_password_expires', type: 'timestamp', nullable: true })
    resetPasswordExpires?: Date | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}
