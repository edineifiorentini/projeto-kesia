import { canBookAppointment } from "@/lib/domain/scheduling";
import {
  apiJson,
  rejectCrossSiteMutation,
  requireApiSession,
  requireJsonRequest,
} from "@/lib/security/api";
import { appointmentCreateSchema } from "@/lib/validation/schemas";

const demoServices = [
  {
    id: "corte-masculino",
    name: "Corte Masculino",
    durationMinutes: 40,
    cleanupMinutes: 10,
    allowedProfessionalIds: ["joao"],
  },
  {
    id: "barba",
    name: "Barba",
    durationMinutes: 30,
    cleanupMinutes: 5,
    allowedProfessionalIds: ["joao"],
  },
];

const existingAppointments = [
  {
    id: "appt-0900",
    professionalId: "joao",
    startsAt: new Date("2026-07-07T09:00:00-03:00"),
    endsAt: new Date("2026-07-07T09:50:00-03:00"),
    status: "confirmed" as const,
  },
];

export async function POST(request: Request) {
  const auth = await requireApiSession("appointments:manage");
  if (auth.response) return auth.response;
  const crossSite = rejectCrossSiteMutation(request);
  if (crossSite) return crossSite;
  const invalidType = requireJsonRequest(request);
  if (invalidType) return invalidType;

  const parsed = appointmentCreateSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return apiJson({ error: "invalid_payload" }, { status: 400 });
  }

  const services = demoServices.filter((service) =>
    parsed.data.serviceIds.includes(service.id),
  );

  const decision = canBookAppointment({
    professionalId: parsed.data.professionalId,
    startsAt: new Date(parsed.data.startsAt),
    services,
    existingAppointments,
  });

  if (!decision.ok) {
    return apiJson({ error: decision.reason }, { status: 409 });
  }

  return apiJson({
    status: "scheduled",
    startsAt: decision.startsAt,
    endsAt: decision.endsAt,
    durationMinutes: decision.durationMinutes,
  });
}
