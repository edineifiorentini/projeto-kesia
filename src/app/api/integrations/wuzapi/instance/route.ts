import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { createWuzApiClientFromEnv } from "@/lib/integrations/wuzapi";

async function requireAdminSession() {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  return null;
}

export async function GET() {
  const unauthorized = await requireAdminSession();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const client = createWuzApiClientFromEnv();
    const [users, status] = await Promise.allSettled([
      client.listUsers(),
      client.getSessionStatus(),
    ]);

    return NextResponse.json({
      users: users.status === "fulfilled" ? users.value : [],
      status: status.status === "fulfilled" ? status.value.data : null,
      errors: {
        users: users.status === "rejected" ? users.reason.message : null,
        status: status.status === "rejected" ? status.reason.message : null,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "wuzapi_unavailable",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 },
    );
  }
}

export async function POST() {
  const unauthorized = await requireAdminSession();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const client = createWuzApiClientFromEnv();
    const instance = await client.ensureDefaultInstance();
    const status = await client.getSessionStatus().catch(() => null);

    return NextResponse.json({
      ...instance,
      status: status?.data ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "wuzapi_instance_failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 },
    );
  }
}
