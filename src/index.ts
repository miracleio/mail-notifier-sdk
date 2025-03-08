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

// Import node-fetch for Node.js environments
let fetchModule: any;
try {
  // First try to use native fetch (for Node.js 18+)
  fetchModule = globalThis.fetch;
} catch (e) {
  // If native fetch is not available, try to use node-fetch
  try {
    // Using dynamic import to avoid issues in browser environments
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    fetchModule = require("node-fetch");
    // Handle both default and named export styles
    if (fetchModule.default) fetchModule = fetchModule.default;
  } catch (err) {
    console.warn(
      "Neither native fetch nor node-fetch is available. Please install node-fetch package for Node.js environments."
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
    if (!fetchModule) {
      throw new Error(
        "Fetch is not available. Please install node-fetch package for Node.js environments."
      );
    }

    const response = await fetchModule(`${this.baseUrl}/api/webhook/email`, {
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
    if (!fetchModule) {
      throw new Error(
        "Fetch is not available. Please install node-fetch package for Node.js environments."
      );
    }

    const response = await fetchModule(
      `${this.baseUrl}/api/webhook/email/status`
    );

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
