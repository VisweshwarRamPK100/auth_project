import { IMfaService } from '../../application/interfaces/IMfaService';
import * as jwt from 'jsonwebtoken';

export class MfaService implements IMfaService {
    private readonly mfaTokenSecret: string;
    private readonly mfaTokenExpiresIn: string = '5m';

constructor() {
  const secret = process.env.MFA_TOKEN_SECRET;

  if (!secret) {
    throw new Error('MFA_TOKEN_SECRET is not configured');
  }

  this.mfaTokenSecret = secret;
}




    generateCode(): string {
        // Generate a random 6-digit code
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    verifyCode(code: string, secret: string): boolean {
        // In a real scenario, this would check against a stored hash or a TOTP
        // For this task, we'll assume the 'secret' passed is the actual code for comparison
        // or a hash of it. Let's assume it's a simple comparison for now.
        return code === secret;
    }

    generateMfaToken(userId: string, email: string): string {
        return jwt.sign({ userId, email, type: 'mfa' }, this.mfaTokenSecret, {
            expiresIn: this.mfaTokenExpiresIn as jwt.SignOptions['expiresIn'],
        });
    }

    verifyMfaToken(token: string): { userId: string; email: string } {
        try {
            const decoded = jwt.verify(token, this.mfaTokenSecret) as any;
            if (decoded.type !== 'mfa') {
                throw new Error('Invalid token type');
            }
            return { userId: decoded.userId, email: decoded.email };
        } catch (error) {
            throw new Error('Invalid or expired MFA token');
        }
    }
}
