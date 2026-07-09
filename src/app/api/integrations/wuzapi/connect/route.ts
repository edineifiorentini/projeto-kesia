import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { createWuzApiClientFromEnv } from "@/lib/integrations/wuzapi";
import type { WuzApiSessionStatus } from "@/lib/integrations/wuzapi";

function isConnected(status: WuzApiSessionStatus | null | undefined) {
  return Boolean(status?.Connected ?? status?.connected);
}

async function requireAdminSession() {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  return null;
}

export async function POST() {
  const unauthorized = await requireAdminSession();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const client = createWuzApiClientFromEnv();
    const instance = await client.ensureDefaultInstance();
    const currentStatus = await client.getSessionStatus().catch(() => null);
    const connection = isConnected(currentStatus?.data)
      ? { success: true, data: { Details: "Session already connected" } }
      : await client.connectSession();
    const status = await client.getSessionStatus().catch(() => currentStatus);

    return NextResponse.json({
      instance,
      connection,
      status: status?.data ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "wuzapi_connect_failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 },
    );
  }
}
