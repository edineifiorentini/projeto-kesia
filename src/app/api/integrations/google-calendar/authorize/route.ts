import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import {
  GOOGLE_OAUTH_STATE_COOKIE,
  googleOAuthCookieOptions,
} from "@/lib/integrations/google-oauth";
import {
  apiJson,
  rejectCrossSiteMutation,
  requireApiSession,
} from "@/lib/security/api";

export async function GET(request: Request) {
  const auth = await requireApiSession("settings:manage");
  if (auth.response) return auth.response;
  const crossSite = rejectCrossSiteMutation(request);
  if (crossSite) return crossSite;

  const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_CALENDAR_REDIRECT_URI;
  if (!clientId || !redirectUri) {
    return apiJson({ error: "google_calendar_not_configured" }, { status: 503 });
  }

  const state = randomBytes(32).toString("base64url");
  const authorizationUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authorizationUrl.searchParams.set("client_id", clientId);
  authorizationUrl.searchParams.set("redirect_uri", redirectUri);
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set(
    "scope",
    "https://www.googleapis.com/auth/calendar.events",
  );
  authorizationUrl.searchParams.set("access_type", "offline");
  authorizationUrl.searchParams.set("prompt", "consent");
  authorizationUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authorizationUrl);
  response.headers.set("Cache-Control", "no-store");
  response.cookies.set(
    GOOGLE_OAUTH_STATE_COOKIE,
    state,
    googleOAuthCookieOptions(),
  );
  return response;
}
