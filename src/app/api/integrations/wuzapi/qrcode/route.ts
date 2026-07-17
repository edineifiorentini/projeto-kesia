import { createWuzApiClientFromEnv } from "@/lib/integrations/wuzapi";
import type { WuzApiSessionStatus } from "@/lib/integrations/wuzapi";
import {
  apiJson,
  rejectCrossSiteMutation,
  reportServerError,
  requireApiSession,
  requireJsonRequest,
} from "@/lib/security/api";
import { wuzApiQrCodeRequestSchema } from "@/lib/validation/schemas";

function isConnected(status: WuzApiSessionStatus | null | undefined) {
  return Boolean(status?.Connected ?? status?.connected);
}

function isLoggedIn(status: WuzApiSessionStatus | null | undefined) {
  return Boolean(status?.LoggedIn ?? status?.loggedIn);
}

async function requestQrCode({ forceNew }: { forceNew: boolean }) {
  const client = createWuzApiClientFromEnv();

  await client.ensureDefaultInstance();

  const currentStatus = await client.getSessionStatus().catch(() => null);

  if (forceNew && isLoggedIn(currentStatus?.data)) {
    await client.logoutSession().catch(() => null);
  }

  const afterLogoutStatus = forceNew
    ? await client.getSessionStatus().catch(() => currentStatus)
    : currentStatus;

  if (!isConnected(afterLogoutStatus?.data) && !isLoggedIn(afterLogoutStatus?.data)) {
    await client.connectSession();
  }

  const [qrCode, status] = await Promise.allSettled([
    client.getQrCode(),
    client.getSessionStatus(),
  ]);

  if (qrCode.status === "rejected") {
    throw qrCode.reason;
  }

  return {
    qrCode: qrCode.value.data?.QRCode ?? null,
    status: status.status === "fulfilled" ? status.value.data : null,
    forceNew,
  };
}

export async function GET() {
  const auth = await requireApiSession("settings:manage");
  if (auth.response) return auth.response;

  try {
    const result = await requestQrCode({ forceNew: false });
    return apiJson(result);
  } catch (error) {
    reportServerError("wuzapi-qrcode-read", error);
    return apiJson({ error: "wuzapi_qrcode_failed" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const auth = await requireApiSession("settings:manage");
  if (auth.response) return auth.response;
  const crossSite = rejectCrossSiteMutation(request);
  if (crossSite) return crossSite;
  const invalidType = requireJsonRequest(request);
  if (invalidType) return invalidType;

  const payload = await request.json().catch(() => ({}));
  const parsed = wuzApiQrCodeRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return apiJson({ error: "invalid_payload" }, { status: 400 });
  }

  try {
    const result = await requestQrCode({ forceNew: parsed.data.forceNew });
    return apiJson(result);
  } catch (error) {
    reportServerError("wuzapi-qrcode-create", error);
    return apiJson({ error: "wuzapi_qrcode_failed" }, { status: 503 });
  }
}
