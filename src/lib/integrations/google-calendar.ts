export type GoogleCalendarAppointment = {
  appointmentId: string;
  summary: string;
  description?: string;
  location?: string;
  startsAt: Date;
  endsAt: Date;
  attendeeEmail?: string;
  timezone?: string;
};

export type GoogleCalendarEvent = {
  id: string;
  htmlLink?: string;
};

export function getGoogleCalendarOAuthConfig() {
  return {
    clientId: process.env.GOOGLE_CALENDAR_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
    redirectUri:
      process.env.GOOGLE_CALENDAR_REDIRECT_URI ??
      `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/integrations/google-calendar/callback`,
    scope: "https://www.googleapis.com/auth/calendar.events",
  };
}

export function isGoogleCalendarConfigured() {
  const config = getGoogleCalendarOAuthConfig();
  return Boolean(config.clientId && config.clientSecret);
}

export function buildGoogleCalendarOAuthUrl(state: string) {
  const config = getGoogleCalendarOAuthConfig();

  if (!config.clientId) {
    throw new Error("GOOGLE_CALENDAR_CLIENT_ID is not configured.");
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    scope: config.scope,
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function createGoogleCalendarEvent(
  accessToken: string,
  calendarId: string,
  appointment: GoogleCalendarAppointment,
): Promise<GoogleCalendarEvent> {
  const timezone = appointment.timezone ?? "America/Sao_Paulo";
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarId || "primary",
    )}/events?sendUpdates=all`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: appointment.appointmentId.replace(/[^a-z0-9]/gi, "").toLowerCase(),
        summary: appointment.summary,
        description: appointment.description,
        location: appointment.location,
        start: {
          dateTime: appointment.startsAt.toISOString(),
          timeZone: timezone,
        },
        end: {
          dateTime: appointment.endsAt.toISOString(),
          timeZone: timezone,
        },
        attendees: appointment.attendeeEmail
          ? [{ email: appointment.attendeeEmail }]
          : undefined,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Google Calendar event failed: ${response.status}`);
  }

  const event = (await response.json()) as GoogleCalendarEvent;
  return event;
}
