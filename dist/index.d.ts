export type EventType = 'error' | 'success' | 'warning' | 'info';
export type ImpactLevel = 'critical' | 'high' | 'medium' | 'low';
export interface EmailPayload {
    to?: string | string[];
    subject: string;
    content: string;
    eventType?: EventType;
    impactLevel?: ImpactLevel;
    sourceApplication?: string;
    metadata?: Record<string, any>;
    attachments?: Array<{
        filename: string;
        content: string | Buffer;
    }>;
    customCredentials?: {
        host: string;
        port: number;
        secure: boolean;
        user: string;
        pass: string;
    };
}
export declare class MailNotifierSDK {
    private baseUrl;
    private token;
    constructor(baseUrl: string | undefined, token: string);
    sendEmail(payload: EmailPayload): Promise<{
        message: string;
        eventType: string;
    }>;
    getStatus(): Promise<{
        status: string;
        message: string;
    }>;
    sendInfo(payload: Omit<EmailPayload, 'eventType'>): Promise<{
        message: string;
        eventType: string;
    }>;
    sendError(payload: Omit<EmailPayload, 'eventType'>): Promise<{
        message: string;
        eventType: string;
    }>;
    sendWarning(payload: Omit<EmailPayload, 'eventType'>): Promise<{
        message: string;
        eventType: string;
    }>;
    sendSuccess(payload: Omit<EmailPayload, 'eventType'>): Promise<{
        message: string;
        eventType: string;
    }>;
}
export default MailNotifierSDK;
