export type MessagePayload = {
  to: string;
  body: string;
  metadata?: Record<string, unknown>;
};

export type MessageProviderResult = {
  providerMessageId: string;
  status: "sent" | "queued";
};

export interface MessageProvider {
  sendWhatsApp(payload: MessagePayload): Promise<MessageProviderResult>;
  sendEmail(payload: MessagePayload & { subject: string }): Promise<MessageProviderResult>;
}

export class MockMessageProvider implements MessageProvider {
  async sendWhatsApp(payload: MessagePayload) {
    return {
      providerMessageId: `mock-whatsapp-${payload.to}`,
      status: "queued" as const,
    };
  }

  async sendEmail(payload: MessagePayload & { subject: string }) {
    return {
      providerMessageId: `mock-email-${payload.to}`,
      status: "queued" as const,
    };
  }
}

export class WuzApiMessageProvider implements MessageProvider {
  constructor(
    private readonly sendText: (payload: MessagePayload) => Promise<{
      messageId: string;
    }>,
  ) {}

  async sendWhatsApp(payload: MessagePayload) {
    const result = await this.sendText(payload);

    return {
      providerMessageId: result.messageId,
      status: "queued" as const,
    };
  }

  async sendEmail(payload: MessagePayload & { subject: string }) {
    return {
      providerMessageId: `email-not-configured-${payload.to}`,
      status: "queued" as const,
    };
  }
}

export function renderTemplate(
  template: string,
  variables: Record<string, string>,
) {
  return Object.entries(variables).reduce(
    (body, [key, value]) => body.replaceAll(`{{${key}}}`, value),
    template,
  );
}
