export type PaymentState = "pending" | "confirmed" | "refunded" | "cancelled";

export type CommissionInput = {
  paymentStatus: PaymentState;
  itemTotalCents: number;
  commissionRate: number;
  professionalId?: string | null;
};

export type CommissionResult =
  | {
      ok: true;
      amountCents: number;
      rate: number;
      status: "available";
    }
  | {
      ok: false;
      reason: "payment_not_confirmed" | "missing_professional";
    };

export function calculateCommission(
  input: CommissionInput,
): CommissionResult {
  if (!input.professionalId) {
    return { ok: false, reason: "missing_professional" };
  }

  if (input.paymentStatus !== "confirmed") {
    return { ok: false, reason: "payment_not_confirmed" };
  }

  return {
    ok: true,
    amountCents: Math.round(input.itemTotalCents * (input.commissionRate / 100)),
    rate: input.commissionRate,
    status: "available",
  };
}

export function discountRequiresApproval(
  subtotalCents: number,
  discountCents: number,
  allowedPercent: number,
) {
  if (subtotalCents <= 0) {
    return false;
  }

  return discountCents / subtotalCents > allowedPercent / 100;
}
