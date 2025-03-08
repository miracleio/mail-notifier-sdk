// src/index.ts

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

/**
 * Dynamically imports node-fetch for Node.js environments
 * without causing issues in browser or newer Node.js with native fetch
 */
async function getFetch() {
  // Try to use the built-in fetch first
  if (typeof globalThis.fetch === "function") {
    return globalThis.fetch.bind(globalThis);
  }

  // If not available, try to dynamically import node-fetch
  try {
    // This dynamic import works with ESM node-fetch v3
    const { default: fetch } = await import("node-fetch");
    return fetch;
  } catch (error) {
    throw new Error(
      "Fetch API is not available. Please ensure you have node-fetch installed or are using Node.js 18+."
    );
  }
}

export class MailNotifierSDK {
  private baseUrl: string;
  private token: string;

  constructor(
    baseUrl: string = "https://mail-notifier-production.up.railway.app",
    token: string
  ) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  async sendEmail(
    payload: EmailPayload
  ): Promise<{ message: string; eventType: string }> {
    const fetch = await getFetch();

    const response = await fetch(`${this.baseUrl}/api/webhook/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": `${this.token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getStatus(): Promise<{ status: string; message: string }> {
    const fetch = await getFetch();

    const response = await fetch(`${this.baseUrl}/api/webhook/email/status`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
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
