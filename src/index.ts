// src/index.ts
import axios from "axios";

export type EventType = "error" | "success" | "warning" | "info";
export type ImpactLevel = "critical" | "high" | "medium" | "low";

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

export class MailNotifierSDK {
  private baseUrl: string;
  private token: string;

  constructor(
    baseUrl: string = "https://mail-notifier.onrender.com",
    token: string
  ) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  async sendEmail(
    payload: EmailPayload
  ): Promise<{ message: string; eventType: string }> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/webhook/email`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": `${this.token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(`HTTP error! status: ${error.response.status}`);
      }
      return { message: (error as Error).message, eventType: "error" };
    }
  }

  async getStatus(): Promise<{ status: string; message: string }> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/api/webhook/email/status`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(`HTTP error! status: ${error.response.status}`);
      }
      return { status: "error", message: (error as Error).message };
    }
  }

  // Convenience methods
  async sendInfo(payload: Omit<EmailPayload, "eventType">) {
    return this.sendEmail({ ...payload, eventType: "info" });
  }

  async sendError(payload: Omit<EmailPayload, "eventType">) {
    return this.sendEmail({ ...payload, eventType: "error" });
  }

  async sendWarning(payload: Omit<EmailPayload, "eventType">) {
    return this.sendEmail({ ...payload, eventType: "warning" });
  }

  async sendSuccess(payload: Omit<EmailPayload, "eventType">) {
    return this.sendEmail({ ...payload, eventType: "success" });
  }
}

export default MailNotifierSDK;
