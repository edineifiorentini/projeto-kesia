import { NextResponse } from "next/server";
import { createGoogleCalendarEvent } from "@/lib/integrations/google-calendar";
import { googleCalendarEventSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const parsed = googleCalendarEventSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const { accessToken, calendarId, startsAt, endsAt, ...appointment } = parsed.data;

  try {
    const event = await createGoogleCalendarEvent(accessToken, calendarId, {
      ...appointment,
      startsAt: new Date(startsAt),
      endsAt: new Date(endsAt),
      timezone: "America/Sao_Paulo",
    });

    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json(
      {
        error: "google_calendar_unavailable",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 },
    );
  }
}
