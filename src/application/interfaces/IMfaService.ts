export interface IMfaService {
    generateCode(): string;
    verifyCode(code: string, secret: string): boolean;
    generateMfaToken(userId: string, email: string): string;
    verifyMfaToken(token: string): { userId: string; email: string };
}
