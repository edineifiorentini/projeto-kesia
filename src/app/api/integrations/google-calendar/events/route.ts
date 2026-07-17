import { createGoogleCalendarEvent } from "@/lib/integrations/google-calendar";
import {
  apiJson,
  rejectCrossSiteMutation,
  reportServerError,
  requireApiSession,
  requireJsonRequest,
} from "@/lib/security/api";
import { googleCalendarEventSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const auth = await requireApiSession("appointments:manage");
  if (auth.response) return auth.response;
  const crossSite = rejectCrossSiteMutation(request);
  if (crossSite) return crossSite;
  const invalidType = requireJsonRequest(request);
  if (invalidType) return invalidType;

  const parsed = googleCalendarEventSchema.safeParse(
    await request.json().catch(() => null),
  );

  if (!parsed.success) {
    return apiJson({ error: "invalid_payload" }, { status: 400 });
  }

  const { accessToken, calendarId, startsAt, endsAt, ...appointment } = parsed.data;

  try {
    const event = await createGoogleCalendarEvent(accessToken, calendarId, {
      ...appointment,
      startsAt: new Date(startsAt),
      endsAt: new Date(endsAt),
      timezone: "America/Sao_Paulo",
    });

    return apiJson(event);
  } catch (error) {
    reportServerError("google-calendar-event", error);
    return apiJson({ error: "google_calendar_unavailable" }, { status: 503 });
  }
}
