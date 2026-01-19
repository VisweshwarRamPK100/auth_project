import nodemailer from 'nodemailer';
import { IEmailService } from '../../application/interfaces/IEmailService';
import { Environment } from '../config/Environment';

export class NodemailerService implements IEmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: Environment.SMTP_HOST,
            port: Environment.SMTP_PORT,
            auth: {
                user: Environment.SMTP_USER,
                pass: Environment.SMTP_PASS,
            },
        });
    }

    async sendEmail(to: string, subject: string, body: string, html?: string): Promise<void> {
        // In development, log the email to console so we can see the link without actual sending
        if (Environment.NODE_ENV === 'development') {
             console.log(`
========== [EmailService] DEVELOPMENT MODE ==========
To: ${to}
Subject: ${subject}
Body: 
${body}
=====================================================
`);
        }

        try {
            await this.transporter.sendMail({
                from: Environment.SMTP_FROM,
                to,
                subject,
                text: body,
                html: html || body,
            });
            console.log(`[EmailService] Email sent to ${to}`);
        } catch (error: any) {
            console.error(`[EmailService] Error sending email to ${to}:`, error);
            
            // Helpful message for Gmail users
            if (error.code === 'EAUTH' && Environment.SMTP_HOST.includes('gmail')) {
                console.error(`
[!] GMAIL AUTHENTICATION FAILED
If you are using Gmail, you cannot use your regular password.
You must enable 2-Factor Authentication and generate an "App Password".
1. Go to Google Account > Security
2. Enable 2-Step Verification
3. Go to "App passwords"
4. Generare a new password and use that as your SMTP_PASS
`);
            }
            throw new Error('Failed to send email');
        }
    }
}
