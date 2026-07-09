import { NextResponse } from "next/server";
import { createMercadoPagoPreference } from "@/lib/integrations/mercado-pago";
import { mercadoPagoPreferenceSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const parsed = mercadoPagoPreferenceSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  try {
    const preference = await createMercadoPagoPreference(parsed.data);
    return NextResponse.json(preference);
  } catch (error) {
    return NextResponse.json(
      {
        error: "mercado_pago_unavailable",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 },
    );
  }
}
