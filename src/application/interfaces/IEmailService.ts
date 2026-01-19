export interface IEmailService {
    sendEmail(to: string, subject: string, body: string, html?: string): Promise<void>;
}
