import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

function verifySignature(body: string, signature: string | null) {
  const secret = process.env.WUZAPI_WEBHOOK_SECRET;

  if (!secret || !signature) {
    return true;
  }

  const expected = createHmac("sha256", secret).update(body).digest("hex");
  const received = signature.replace(/^sha256=/, "");

  return (
    expected.length === received.length &&
    timingSafeEqual(Buffer.from(expected), Buffer.from(received))
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature =
    request.headers.get("x-hub-signature-256") ??
    request.headers.get("x-signature") ??
    request.headers.get("x-wuzapi-signature") ??
    request.headers.get("x-hmac-signature");

  if (!verifySignature(body, signature)) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  const event = body ? JSON.parse(body) : {};

  return NextResponse.json({
    received: true,
    provider: "wuzapi",
    eventType: event.event ?? event.type ?? "unknown",
  });
}
