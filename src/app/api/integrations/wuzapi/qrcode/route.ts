import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { createWuzApiClientFromEnv } from "@/lib/integrations/wuzapi";
import type { WuzApiSessionStatus } from "@/lib/integrations/wuzapi";
import { wuzApiQrCodeRequestSchema } from "@/lib/validation/schemas";

function isConnected(status: WuzApiSessionStatus | null | undefined) {
  return Boolean(status?.Connected ?? status?.connected);
}

function isLoggedIn(status: WuzApiSessionStatus | null | undefined) {
  return Boolean(status?.LoggedIn ?? status?.loggedIn);
}

async function requireAdminSession() {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  return null;
}

async function requestQrCode({ forceNew }: { forceNew: boolean }) {
  const client = createWuzApiClientFromEnv();

  await client.ensureDefaultInstance();

  const currentStatus = await client.getSessionStatus().catch(() => null);

  if (forceNew && isLoggedIn(currentStatus?.data)) {
    await client.logoutSession().catch(() => null);
  }

  const afterLogoutStatus = forceNew
    ? await client.getSessionStatus().catch(() => currentStatus)
    : currentStatus;

  if (!isConnected(afterLogoutStatus?.data) && !isLoggedIn(afterLogoutStatus?.data)) {
    await client.connectSession();
  }

  const [qrCode, status] = await Promise.allSettled([
    client.getQrCode(),
    client.getSessionStatus(),
  ]);

  if (qrCode.status === "rejected") {
    throw qrCode.reason;
  }

  return {
    qrCode: qrCode.value.data?.QRCode ?? null,
    status: status.status === "fulfilled" ? status.value.data : null,
    forceNew,
  };
}

export async function GET() {
  const unauthorized = await requireAdminSession();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const result = await requestQrCode({ forceNew: false });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: "wuzapi_qrcode_failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminSession();

  if (unauthorized) {
    return unauthorized;
  }

  const payload = await request.json().catch(() => ({}));
  const parsed = wuzApiQrCodeRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  try {
    const result = await requestQrCode({ forceNew: parsed.data.forceNew });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: "wuzapi_qrcode_failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 },
    );
  }
}
