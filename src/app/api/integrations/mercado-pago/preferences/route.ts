import { createMercadoPagoPreference } from "@/lib/integrations/mercado-pago";
import {
  apiJson,
  rejectCrossSiteMutation,
  reportServerError,
  requireApiSession,
  requireJsonRequest,
} from "@/lib/security/api";
import { mercadoPagoPreferenceSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const auth = await requireApiSession("financial:manage");
  if (auth.response) return auth.response;
  const crossSite = rejectCrossSiteMutation(request);
  if (crossSite) return crossSite;
  const invalidType = requireJsonRequest(request);
  if (invalidType) return invalidType;

  const parsed = mercadoPagoPreferenceSchema.safeParse(
    await request.json().catch(() => null),
  );

  if (!parsed.success) {
    return apiJson({ error: "invalid_payload" }, { status: 400 });
  }

  try {
    const preference = await createMercadoPagoPreference(parsed.data);
    return apiJson(preference);
  } catch (error) {
    reportServerError("mercado-pago-preference", error);
    return apiJson({ error: "mercado_pago_unavailable" }, { status: 503 });
  }
}
