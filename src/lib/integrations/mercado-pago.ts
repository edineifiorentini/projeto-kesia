export type MercadoPagoPreferenceItem = {
  id: string;
  title: string;
  quantity: number;
  unitPriceCents: number;
};

export type MercadoPagoPreferenceInput = {
  commandId: string;
  payerEmail?: string;
  items: MercadoPagoPreferenceItem[];
  notificationUrl?: string;
  successUrl?: string;
  pendingUrl?: string;
  failureUrl?: string;
};

export type MercadoPagoPreference = {
  id: string;
  initPoint: string;
  sandboxInitPoint?: string;
};

export function isMercadoPagoConfigured() {
  return Boolean(process.env.MERCADO_PAGO_ACCESS_TOKEN);
}

export async function createMercadoPagoPreference(
  input: MercadoPagoPreferenceInput,
): Promise<MercadoPagoPreference> {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error("MERCADO_PAGO_ACCESS_TOKEN is not configured.");
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      external_reference: input.commandId,
      notification_url: input.notificationUrl,
      payer: input.payerEmail ? { email: input.payerEmail } : undefined,
      items: input.items.map((item) => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        currency_id: "BRL",
        unit_price: item.unitPriceCents / 100,
      })),
      back_urls: {
        success: input.successUrl ?? `${appUrl}/financial?payment=success`,
        pending: input.pendingUrl ?? `${appUrl}/financial?payment=pending`,
        failure: input.failureUrl ?? `${appUrl}/financial?payment=failure`,
      },
      auto_return: "approved",
    }),
  });

  if (!response.ok) {
    throw new Error(`Mercado Pago preference failed: ${response.status}`);
  }

  const preference = (await response.json()) as {
    id: string;
    init_point: string;
    sandbox_init_point?: string;
  };

  return {
    id: preference.id,
    initPoint: preference.init_point,
    sandboxInitPoint: preference.sandbox_init_point,
  };
}
