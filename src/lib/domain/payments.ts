export type PaymentSplit = {
  method: "cash" | "pix" | "debitCard" | "creditCard" | "bankTransfer" | "online";
  amountCents: number;
};

export function paymentsMatchTotal(
  totalCents: number,
  payments: PaymentSplit[],
) {
  return payments.reduce((sum, payment) => sum + payment.amountCents, 0) === totalCents;
}
