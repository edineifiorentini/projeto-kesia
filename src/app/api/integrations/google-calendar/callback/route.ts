import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code) {
    return NextResponse.json({ error: "missing_code" }, { status: 400 });
  }

  return NextResponse.json({
    received: true,
    provider: "google_calendar",
    state,
    nextStep: "Exchange this OAuth code for tokens and store them encrypted.",
  });
}
