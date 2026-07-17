import { createWuzApiClientFromEnv } from "@/lib/integrations/wuzapi";
import {
  apiJson,
  rejectCrossSiteMutation,
  reportServerError,
  requireApiSession,
} from "@/lib/security/api";

export async function GET() {
  const auth = await requireApiSession("settings:manage");
  if (auth.response) return auth.response;

  try {
    const client = createWuzApiClientFromEnv();
    const [users, status] = await Promise.allSettled([
      client.listUsers(),
      client.getSessionStatus(),
    ]);

    return apiJson({
      users: users.status === "fulfilled" ? users.value : [],
      status: status.status === "fulfilled" ? status.value.data : null,
    });
  } catch (error) {
    reportServerError("wuzapi-instance-status", error);
    return apiJson({ error: "wuzapi_unavailable" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const auth = await requireApiSession("settings:manage");
  if (auth.response) return auth.response;
  const crossSite = rejectCrossSiteMutation(request);
  if (crossSite) return crossSite;

  try {
    const client = createWuzApiClientFromEnv();
    const instance = await client.ensureDefaultInstance();
    const status = await client.getSessionStatus().catch(() => null);

    return apiJson({
      ...instance,
      status: status?.data ?? null,
    });
  } catch (error) {
    reportServerError("wuzapi-instance-create", error);
    return apiJson({ error: "wuzapi_instance_failed" }, { status: 503 });
  }
}
