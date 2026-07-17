import { createWuzApiClientFromEnv } from "@/lib/integrations/wuzapi";
import type { WuzApiSessionStatus } from "@/lib/integrations/wuzapi";
import {
  apiJson,
  rejectCrossSiteMutation,
  reportServerError,
  requireApiSession,
} from "@/lib/security/api";

function isConnected(status: WuzApiSessionStatus | null | undefined) {
  return Boolean(status?.Connected ?? status?.connected);
}

export async function POST(request: Request) {
  const auth = await requireApiSession("settings:manage");
  if (auth.response) return auth.response;
  const crossSite = rejectCrossSiteMutation(request);
  if (crossSite) return crossSite;

  try {
    const client = createWuzApiClientFromEnv();
    const instance = await client.ensureDefaultInstance();
    const currentStatus = await client.getSessionStatus().catch(() => null);
    const connection = isConnected(currentStatus?.data)
      ? { success: true, data: { Details: "Session already connected" } }
      : await client.connectSession();
    const status = await client.getSessionStatus().catch(() => currentStatus);

    return apiJson({
      instance,
      connection,
      status: status?.data ?? null,
    });
  } catch (error) {
    reportServerError("wuzapi-connect", error);
    return apiJson({ error: "wuzapi_connect_failed" }, { status: 503 });
  }
}
