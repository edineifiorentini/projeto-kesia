export type WuzApiConfig = {
  baseUrl: string;
  sessionToken: string;
  adminToken?: string;
  instanceName?: string;
  webhookUrl?: string;
  webhookSecret?: string;
  events?: string[];
};

export type WuzApiResponse<TData = unknown> = {
  code?: number;
  data?: TData;
  success?: boolean;
};

export type WuzApiSessionStatus = {
  Connected?: boolean;
  LoggedIn?: boolean;
  connected?: boolean;
  loggedIn?: boolean;
};

export type WuzApiUser = {
  id: number | string;
  name: string;
  token: string;
  webhook?: string;
  jid?: string;
  qrcode?: string;
  connected?: boolean;
  expiration?: number;
  events?: string;
};

export class WuzApiClient {
  private readonly baseUrl: string;
  private readonly sessionToken: string;
  private readonly adminToken: string;
  private readonly instanceName: string;
  private readonly webhookUrl: string;
  private readonly webhookSecret: string;
  private readonly events: string[];

  constructor(config: WuzApiConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.sessionToken = config.sessionToken;
    this.adminToken = config.adminToken ?? "";
    this.instanceName = config.instanceName ?? "kesia-dutra-cabeleireira";
    this.webhookUrl = config.webhookUrl ?? "";
    this.webhookSecret = config.webhookSecret ?? "";
    this.events = config.events ?? ["Message", "ReadReceipt"];
  }

  async listUsers() {
    const result = await this.adminRequest<WuzApiResponse<WuzApiUser[]> | WuzApiUser[]>(
      "/admin/users",
      {
        method: "GET",
      },
    );

    return Array.isArray(result) ? result : result.data ?? [];
  }

  async createUser(input?: {
    name?: string;
    token?: string;
    webhook?: string;
    events?: string[];
  }): Promise<{ id: number | string }> {
    const name = input?.name ?? this.instanceName;
    const token = input?.token ?? this.sessionToken;
    const webhook = input?.webhook ?? this.webhookUrl;
    const events = input?.events ?? this.events;

    const result = await this.adminRequest<
      WuzApiResponse<{ id: number | string }> | { id: number | string }
    >("/admin/users", {
      method: "POST",
      body: JSON.stringify({
        name,
        token,
        webhook,
        events: events.join(","),
      }),
    });

    if ("data" in result && result.data) {
      return result.data;
    }

    return result as { id: number | string };
  }

  async deleteUser(id: number) {
    return this.adminRequest(`/admin/users/${id}`, {
      method: "DELETE",
    });
  }

  async ensureDefaultInstance() {
    const users = await this.listUsers();
    const existing = users.find(
      (user) => user.token === this.sessionToken || user.name === this.instanceName,
    );

    if (existing) {
      await this.setWebhook(this.webhookUrl);
      await this.configureHmacIfAvailable();

      return {
        created: false,
        instance: existing,
      };
    }

    const created = await this.createUser();
    await this.setWebhook(this.webhookUrl);
    await this.configureHmacIfAvailable();

    return {
      created: true,
      instance: {
        id: created.id,
        name: this.instanceName,
        token: this.sessionToken,
        webhook: this.webhookUrl,
        events: this.events.join(","),
      } satisfies WuzApiUser,
    };
  }

  async getSessionStatus() {
    return this.request<WuzApiSessionStatus>("/session/status", {
      method: "GET",
    });
  }

  async connectSession() {
    return this.request("/session/connect", {
      method: "POST",
      body: JSON.stringify({
        Subscribe: this.events,
        Immediate: false,
      }),
    });
  }

  async logoutSession() {
    return this.request("/session/logout", {
      method: "POST",
    });
  }

  async getQrCode() {
    return this.request<{ QRCode: string }>("/session/qr", {
      method: "GET",
    });
  }

  async setWebhook(webhookUrl: string) {
    if (!webhookUrl) {
      return {
        success: false,
        data: { Details: "WUZAPI_WEBHOOK_URL is not configured." },
      } satisfies WuzApiResponse<{ Details: string }>;
    }

    return this.request("/webhook", {
      method: "POST",
      body: JSON.stringify({ webhookURL: webhookUrl }),
    });
  }

  async configureHmacIfAvailable() {
    if (!this.webhookSecret || this.webhookSecret.length < 32) {
      return {
        success: false,
        data: { Details: "WUZAPI_WEBHOOK_SECRET must have at least 32 characters." },
      } satisfies WuzApiResponse<{ Details: string }>;
    }

    return this.request("/session/hmac/config", {
      method: "POST",
      body: JSON.stringify({ hmac_key: this.webhookSecret }),
    });
  }

  async sendTextMessage(input: {
    phone: string;
    body: string;
    id?: string;
    linkPreview?: boolean;
  }) {
    return this.request<{ Details: string; Id: string; Timestamp: string }>(
      "/chat/send/text",
      {
        method: "POST",
        body: JSON.stringify({
          Phone: input.phone,
          Body: input.body,
          Id: input.id,
          LinkPreview: input.linkPreview ?? false,
        }),
      },
    );
  }

  private async request<TData>(
    path: string,
    init: RequestInit,
  ): Promise<WuzApiResponse<TData>> {
    if (!this.sessionToken) {
      throw new Error("WUZAPI_SESSION_TOKEN is not configured.");
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        Authorization: this.sessionToken,
        Token: this.sessionToken,
        "Content-Type": "application/json",
        ...init.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`WuzAPI request failed: ${response.status}`);
    }

    return (await response.json()) as WuzApiResponse<TData>;
  }

  private async adminRequest<TData>(
    path: string,
    init: RequestInit,
  ): Promise<TData> {
    if (!this.adminToken) {
      throw new Error("WUZAPI_ADMIN_TOKEN is not configured.");
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        Authorization: this.adminToken,
        "Content-Type": "application/json",
        ...init.headers,
      },
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(
        `WuzAPI admin request failed: ${response.status}${
          details ? ` - ${details}` : ""
        }`,
      );
    }

    return (await response.json()) as TData;
  }
}

export function createWuzApiClientFromEnv() {
  return new WuzApiClient({
    baseUrl: process.env.WUZAPI_BASE_URL ?? "http://localhost:8080",
    sessionToken:
      process.env.WUZAPI_SESSION_TOKEN ?? "kesia-dutra-whatsapp-session-token",
    adminToken: process.env.WUZAPI_ADMIN_TOKEN ?? "change-me-admin-token",
    instanceName: process.env.WUZAPI_INSTANCE_NAME ?? "kesia-dutra-cabeleireira",
    webhookUrl:
      process.env.WUZAPI_WEBHOOK_URL ??
      "http://host.docker.internal:3000/api/webhooks/wuzapi",
    webhookSecret: process.env.WUZAPI_WEBHOOK_SECRET ?? "",
  });
}

export function isWuzApiConfigured() {
  return Boolean(
    process.env.WUZAPI_BASE_URL &&
      process.env.WUZAPI_ADMIN_TOKEN &&
      process.env.WUZAPI_SESSION_TOKEN,
  );
}
