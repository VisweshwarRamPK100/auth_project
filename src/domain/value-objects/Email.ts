export class Email {
    private readonly value: string;

    constructor(email: string) {
        this.value = email.toLowerCase().trim();
        this.validate();
    }

    private validate(): void {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.value)) {
            throw new Error('Invalid email format');
        }
    }

    getValue(): string {
        return this.value;
    }

    equals(other: Email): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
