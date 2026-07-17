import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import {
  GOOGLE_OAUTH_STATE_COOKIE,
  googleOAuthCookieOptions,
} from "@/lib/integrations/google-oauth";
import { apiJson, requireApiSession } from "@/lib/security/api";

function stateMatches(received: string, expected: string) {
  const receivedBuffer = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);
  return (
    receivedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(receivedBuffer, expectedBuffer)
  );
}

export async function GET(request: Request) {
  const auth = await requireApiSession("settings:manage");
  if (auth.response) return auth.response;

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const expectedState = (await cookies()).get(GOOGLE_OAUTH_STATE_COOKIE)?.value;

  if (!state || !expectedState || !stateMatches(state, expectedState)) {
    return apiJson({ error: "invalid_oauth_state" }, { status: 400 });
  }
  if (!code) {
    return apiJson({ error: "missing_code" }, { status: 400 });
  }

  const response = apiJson({
    received: true,
    provider: "google_calendar",
    nextStep: "exchange_and_store_encrypted_tokens",
  });
  response.cookies.set(
    GOOGLE_OAUTH_STATE_COOKIE,
    "",
    googleOAuthCookieOptions(0),
  );
  return response;
}
