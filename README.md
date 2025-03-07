# Mail Notifier SDK

A simple SDK for interacting with the Email Monitoring Service. This SDK allows you to easily send email notifications with different event types (error, success, warning, info) and customizable content.

## Installation

```bash
npm install mail-notifier-sdk
# or
yarn add mail-notifier-sdk
```

## Quick Start

### Initialize the SDK

```javascript
import MailNotifierSDK from 'mail-notifier-sdk';

// Initialize with your API token
const mailNotifier = new MailNotifierSDK('https://mail-notifier-production.up.railway.app', 'your-api-token');

// Or use the default URL
const mailNotifier = new MailNotifierSDK(undefined, 'your-api-token');
```

### Send a Basic Email

```javascript
const sendEmail = async () => {
  try {
    const result = await mailNotifier.sendEmail({
      to: 'recipient@example.com',
      subject: 'Hello from Mail Notifier SDK',
      content: 'This is a test email sent from the Mail Notifier SDK.',
      eventType: 'info',
      impactLevel: 'low'
    });
    
    console.log('Email sent successfully:', result);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};
```

## Usage Guide

### Sending Different Types of Emails

The SDK provides convenience methods for sending emails with different event types:

#### Info Email

```javascript
await mailNotifier.sendInfo({
  to: 'recipient@example.com',
  subject: 'Information Notification',
  content: 'This is an informational message.',
  impactLevel: 'low'
});
```

#### Error Email

```javascript
await mailNotifier.sendError({
  to: 'recipient@example.com',
  subject: 'Error Notification',
  content: 'An error occurred in the application.',
  impactLevel: 'high',
  sourceApplication: 'backend-service'
});
```

#### Warning Email

```javascript
await mailNotifier.sendWarning({
  to: 'recipient@example.com',
  subject: 'Warning Notification',
  content: 'This is a warning message.',
  impactLevel: 'medium'
});
```

#### Success Email

```javascript
await mailNotifier.sendSuccess({
  to: 'recipient@example.com',
  subject: 'Success Notification',
  content: 'Operation completed successfully!',
  impactLevel: 'low'
});
```

### Customizing Email Payloads

You can customize your emails with additional options:

#### Multiple Recipients

```javascript
await mailNotifier.sendInfo({
  to: ['recipient1@example.com', 'recipient2@example.com'],
  subject: 'Notification for Multiple Recipients',
  content: 'This email is sent to multiple recipients.'
});
```

#### Adding Metadata

```javascript
await mailNotifier.sendError({
  to: 'recipient@example.com',
  subject: 'Error with Metadata',
  content: 'Error details with additional metadata.',
  metadata: {
    errorCode: 'ERR_123',
    timestamp: new Date().toISOString(),
    requestId: 'req-456-abc',
    userInfo: {
      id: 123,
      username: 'testuser'
    }
  }
});
```

#### Adding Attachments

```javascript
await mailNotifier.sendInfo({
  to: 'recipient@example.com',
  subject: 'Email with Attachments',
  content: 'Please find the attached files.',
  attachments: [
    {
      filename: 'report.pdf',
      content: Buffer.from('PDF content here')
    },
    {
      filename: 'data.json',
      content: JSON.stringify({ key: 'value' })
    }
  ]
});
```

#### Using Custom SMTP Credentials

```javascript
await mailNotifier.sendEmail({
  to: 'recipient@example.com',
  subject: 'Email with Custom SMTP',
  content: 'This email is sent using custom SMTP settings.',
  eventType: 'info',
  customCredentials: {
    host: 'smtp.custom-server.com',
    port: 587,
    secure: false,
    user: 'smtp-username',
    pass: 'smtp-password'
  }
});
```

### Checking Server Status

You can check the status of the email notification service:

```javascript
const checkServerStatus = async () => {
  try {
    const status = await mailNotifier.getStatus();
    console.log('Server status:', status);
    // Example output: { status: 'online', message: 'Server is healthy' }
  } catch (error) {
    console.error('Failed to check server status:', error);
  }
};
```

## API Reference

### `MailNotifierSDK` Class

#### Constructor

```typescript
constructor(baseUrl: string = 'https://mail-notifier-production.up.railway.app', token: string)
```

- `baseUrl`: (Optional) The base URL of the Mail Notifier service
- `token`: Your API token for authentication

#### Methods

##### `sendEmail(payload: EmailPayload): Promise<{ message: string; eventType: string }>`

Sends an email with the specified payload.

##### `getStatus(): Promise<{ status: string; message: string }>`

Retrieves the current status of the Mail Notifier service.

##### Convenience Methods

- `sendInfo(payload: Omit<EmailPayload, 'eventType'>)`: Sends an info email
- `sendError(payload: Omit<EmailPayload, 'eventType'>)`: Sends an error email
- `sendWarning(payload: Omit<EmailPayload, 'eventType'>)`: Sends a warning email
- `sendSuccess(payload: Omit<EmailPayload, 'eventType'>)`: Sends a success email

### `EmailPayload` Interface

```typescript
interface EmailPayload {
  to?: string | string[];                 // Recipient email address(es)
  subject: string;                        // Email subject line
  content: string;                        // Email body content
  eventType?: 'error' | 'success' | 'warning' | 'info';  // Type of event
  impactLevel?: 'critical' | 'high' | 'medium' | 'low';  // Impact severity
  sourceApplication?: string;             // Source application identifier
  metadata?: Record<string, any>;         // Additional metadata as key-value pairs
  attachments?: Array<{                   // File attachments
    filename: string;
    content: string | Buffer;
  }>;
  customCredentials?: {                   // Custom SMTP server credentials
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
  };
}
```

## Error Handling

The SDK throws errors for failed requests. Always wrap your calls in try/catch blocks:

```javascript
try {
  await mailNotifier.sendEmail({...});
} catch (error) {
  // Handle error
  console.error('Error sending email:', error.message);
}
```
