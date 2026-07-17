import { createWuzApiClientFromEnv } from "@/lib/integrations/wuzapi";
import {
  apiJson,
  rejectCrossSiteMutation,
  reportServerError,
  requireApiSession,
  requireJsonRequest,
} from "@/lib/security/api";
import { wuzApiMessageSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const auth = await requireApiSession("settings:manage");
  if (auth.response) return auth.response;
  const crossSite = rejectCrossSiteMutation(request);
  if (crossSite) return crossSite;
  const invalidType = requireJsonRequest(request);
  if (invalidType) return invalidType;

  const parsed = wuzApiMessageSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return apiJson({ error: "invalid_payload" }, { status: 400 });
  }

  try {
    const client = createWuzApiClientFromEnv();
    const result = await client.sendTextMessage(parsed.data);
    return apiJson(result);
  } catch (error) {
    reportServerError("wuzapi-message", error);
    return apiJson({ error: "wuzapi_unavailable" }, { status: 503 });
  }
}
