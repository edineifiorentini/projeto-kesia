import { describe, expect, it } from "vitest";
import {
  canBookAppointment,
  calculateAppointmentDuration,
  type ServiceForScheduling,
} from "../src/lib/domain/scheduling";
import { calculateCommission } from "../src/lib/domain/commissions";
import { applyProductSale } from "../src/lib/domain/inventory";

const haircut: ServiceForScheduling = {
  id: "haircut",
  name: "Corte Masculino",
  durationMinutes: 40,
  cleanupMinutes: 10,
  allowedProfessionalIds: ["joao"],
};

const coloring: ServiceForScheduling = {
  id: "coloring",
  name: "Coloracao",
  durationMinutes: 150,
  preparationMinutes: 15,
  cleanupMinutes: 15,
  allowedProfessionalIds: ["ana"],
};

describe("appointment scheduling", () => {
  it("calculates duration with preparation and cleanup time", () => {
    expect(calculateAppointmentDuration([coloring])).toBe(180);
  });

  it("prevents double booking for a professional", () => {
    const decision = canBookAppointment({
      professionalId: "joao",
      startsAt: new Date("2026-07-07T09:20:00-03:00"),
      services: [haircut],
      existingAppointments: [
        {
          id: "existing",
          professionalId: "joao",
          startsAt: new Date("2026-07-07T09:00:00-03:00"),
          endsAt: new Date("2026-07-07T09:50:00-03:00"),
          status: "confirmed",
        },
      ],
    });

    expect(decision).toEqual({
      ok: false,
      reason: "double_booking",
      conflictingAppointmentId: "existing",
    });
  });

  it("requires the professional to be allowed for every service", () => {
    const decision = canBookAppointment({
      professionalId: "joao",
      startsAt: new Date("2026-07-07T13:00:00-03:00"),
      services: [coloring],
      existingAppointments: [],
    });

    expect(decision).toEqual({
      ok: false,
      reason: "professional_not_allowed",
    });
  });
});

describe("commission management", () => {
  it("generates commission only after payment confirmation", () => {
    expect(
      calculateCommission({
        paymentStatus: "pending",
        itemTotalCents: 6000,
        commissionRate: 45,
        professionalId: "joao",
      }),
    ).toEqual({ ok: false, reason: "payment_not_confirmed" });

    expect(
      calculateCommission({
        paymentStatus: "confirmed",
        itemTotalCents: 6000,
        commissionRate: 45,
        professionalId: "joao",
      }),
    ).toEqual({
      ok: true,
      amountCents: 2700,
      rate: 45,
      status: "available",
    });
  });
});

describe("inventory management", () => {
  it("decreases stock when a product is sold and flags low stock", () => {
    const result = applyProductSale(
      {
        id: "pomade",
        name: "Pomada Modeladora",
        stockQuantity: 6,
        minimumStock: 5,
      },
      1,
    );

    expect(result).toEqual({
      ok: true,
      product: {
        id: "pomade",
        name: "Pomada Modeladora",
        stockQuantity: 5,
        minimumStock: 5,
      },
      movement: {
        productId: "pomade",
        type: "sale",
        quantity: -1,
        reason: "Venda no checkout",
      },
      lowStock: true,
    });
  });
});
