import { NextResponse } from "next/server";
import { createWuzApiClientFromEnv } from "@/lib/integrations/wuzapi";
import { wuzApiMessageSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const parsed = wuzApiMessageSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  try {
    const client = createWuzApiClientFromEnv();
    const result = await client.sendTextMessage(parsed.data);
    return NextResponse.json(result);
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
