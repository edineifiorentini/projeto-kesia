export const GOOGLE_OAUTH_STATE_COOKIE = "google_calendar_oauth_state";

export function googleOAuthCookieOptions(maxAge = 10 * 60) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/api/integrations/google-calendar",
    maxAge,
  };
}
