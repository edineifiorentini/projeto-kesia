export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "arrived"
  | "inProgress"
  | "completed"
  | "missed"
  | "cancelled";

export type ServiceForScheduling = {
  id: string;
  name: string;
  durationMinutes: number;
  preparationMinutes?: number;
  cleanupMinutes?: number;
  allowedProfessionalIds: string[];
};

export type ExistingAppointment = {
  id: string;
  professionalId: string;
  startsAt: Date;
  endsAt: Date;
  status: AppointmentStatus;
};

export type BookingRequest = {
  professionalId: string;
  startsAt: Date;
  services: ServiceForScheduling[];
  existingAppointments: ExistingAppointment[];
};

export type BookingDecision =
  | {
      ok: true;
      startsAt: Date;
      endsAt: Date;
      durationMinutes: number;
    }
  | {
      ok: false;
      reason: "professional_not_allowed" | "double_booking" | "empty_services";
      conflictingAppointmentId?: string;
    };

const blockingStatuses: AppointmentStatus[] = [
  "scheduled",
  "confirmed",
  "arrived",
  "inProgress",
];

export function calculateAppointmentDuration(
  services: ServiceForScheduling[],
) {
  return services.reduce(
    (total, service) =>
      total +
      service.durationMinutes +
      (service.preparationMinutes ?? 0) +
      (service.cleanupMinutes ?? 0),
    0,
  );
}

export function calculateAppointmentEnd(
  startsAt: Date,
  services: ServiceForScheduling[],
) {
  const durationMinutes = calculateAppointmentDuration(services);
  return new Date(startsAt.getTime() + durationMinutes * 60_000);
}

export function intervalsOverlap(
  leftStart: Date,
  leftEnd: Date,
  rightStart: Date,
  rightEnd: Date,
) {
  return leftStart < rightEnd && rightStart < leftEnd;
}

export function canBookAppointment(
  request: BookingRequest,
): BookingDecision {
  if (request.services.length === 0) {
    return { ok: false, reason: "empty_services" };
  }

  const isAllowed = request.services.every((service) =>
    service.allowedProfessionalIds.includes(request.professionalId),
  );

  if (!isAllowed) {
    return { ok: false, reason: "professional_not_allowed" };
  }

  const endsAt = calculateAppointmentEnd(request.startsAt, request.services);

  const conflict = request.existingAppointments.find(
    (appointment) =>
      appointment.professionalId === request.professionalId &&
      blockingStatuses.includes(appointment.status) &&
      intervalsOverlap(
        request.startsAt,
        endsAt,
        appointment.startsAt,
        appointment.endsAt,
      ),
  );

  if (conflict) {
    return {
      ok: false,
      reason: "double_booking",
      conflictingAppointmentId: conflict.id,
    };
  }

  return {
    ok: true,
    startsAt: request.startsAt,
    endsAt,
    durationMinutes: calculateAppointmentDuration(request.services),
  };
}
