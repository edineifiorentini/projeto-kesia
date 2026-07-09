import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/permissions";
import { demoSession } from "@/lib/auth/session";
import { canBookAppointment } from "@/lib/domain/scheduling";
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
  try {
    requirePermission(demoSession.role, "appointments:manage");
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const parsed = appointmentCreateSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
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
    return NextResponse.json({ error: decision.reason }, { status: 409 });
  }

  return NextResponse.json({
    status: "scheduled",
    startsAt: decision.startsAt,
    endsAt: decision.endsAt,
    durationMinutes: decision.durationMinutes,
  });
}
