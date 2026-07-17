import { createHmac, timingSafeEqual } from "node:crypto";
import { apiJson, checkRateLimit } from "@/lib/security/api";

type WuzApiWebhookPayload = { event?: string; type?: string };

function verifySignature(body: string, signature: string | null) {
  const secret = process.env.WUZAPI_WEBHOOK_SECRET;
  if (!secret || secret.length < 32) {
    return { ok: false, notConfigured: true };
  }
  if (!signature) return { ok: false, notConfigured: false };

  const received = signature.replace(/^sha256=/i, "");
  if (!/^[a-f\d]{64}$/i.test(received)) {
    return { ok: false, notConfigured: false };
  }

  const expected = createHmac("sha256", secret).update(body).digest("hex");
  return {
    ok: timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(received, "hex")),
    notConfigured: false,
  };
}

export async function POST(request: Request) {
  const rateLimited = checkRateLimit(request, "wuzapi-webhook", {
    limit: 300,
    windowMs: 60_000,
  });
  if (rateLimited) return rateLimited;

  const body = await request.text();
  const signature =
    request.headers.get("x-hub-signature-256") ??
    request.headers.get("x-signature") ??
    request.headers.get("x-wuzapi-signature") ??
    request.headers.get("x-hmac-signature");
  const validation = verifySignature(body, signature);

  if (validation.notConfigured) {
    return apiJson({ error: "webhook_not_configured" }, { status: 503 });
  }
  if (!validation.ok) {
    return apiJson({ error: "invalid_signature" }, { status: 401 });
  }

  let event: WuzApiWebhookPayload;
  try {
    event = body ? (JSON.parse(body) as WuzApiWebhookPayload) : {};
  } catch {
    return apiJson({ error: "invalid_payload" }, { status: 400 });
  }

  return apiJson({
    received: true,
    provider: "wuzapi",
    eventType: event.event ?? event.type ?? "unknown",
  });
}
