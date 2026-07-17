import { createHmac, timingSafeEqual } from "node:crypto";
import { apiJson, checkRateLimit } from "@/lib/security/api";

type MercadoPagoWebhookPayload = {
  action?: string;
  type?: string;
  data?: { id?: string | number };
};

function parseSignature(value: string | null) {
  const parts = new Map<string, string>();
  for (const item of value?.split(",") ?? []) {
    const [key, ...rest] = item.trim().split("=");
    if (key && rest.length) parts.set(key, rest.join("="));
  }
  return { timestamp: parts.get("ts"), signature: parts.get("v1") };
}

function safeHexEqual(expected: string, received: string) {
  if (!/^[a-f\d]{64}$/i.test(received)) return false;
  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(received, "hex");
  return timingSafeEqual(expectedBuffer, receivedBuffer);
}

function verifySignature(request: Request, dataId: string) {
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  const requestId = request.headers.get("x-request-id");
  const { timestamp, signature } = parseSignature(
    request.headers.get("x-signature"),
  );

  if (!secret) return { ok: false, notConfigured: true };
  if (!requestId || !timestamp || !signature || !dataId) {
    return { ok: false, notConfigured: false };
  }

  const manifest = `id:${dataId};request-id:${requestId};ts:${timestamp};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");
  return { ok: safeHexEqual(expected, signature), notConfigured: false };
}

export async function POST(request: Request) {
  const rateLimited = checkRateLimit(request, "mercado-pago-webhook", {
    limit: 240,
    windowMs: 60_000,
  });
  if (rateLimited) return rateLimited;

  const body = await request.text();
  let payload: MercadoPagoWebhookPayload;
  try {
    payload = body ? (JSON.parse(body) as MercadoPagoWebhookPayload) : {};
  } catch {
    return apiJson({ error: "invalid_payload" }, { status: 400 });
  }

  const url = new URL(request.url);
  const dataId = String(url.searchParams.get("data.id") ?? payload.data?.id ?? "");
  const validation = verifySignature(request, dataId);

  if (validation.notConfigured) {
    return apiJson({ error: "webhook_not_configured" }, { status: 503 });
  }
  if (!validation.ok) {
    return apiJson({ error: "invalid_signature" }, { status: 401 });
  }

  return apiJson({
    received: true,
    provider: "mercado_pago",
    eventType: payload.type ?? payload.action ?? "unknown",
  });
}
