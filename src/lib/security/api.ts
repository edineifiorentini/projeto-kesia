import { NextResponse } from "next/server";
import { getCurrentSession, type AppSession } from "@/lib/auth/session";
import { hasPermission, type Permission } from "@/lib/auth/permissions";

type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

function clientAddress(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export function apiJson(data: unknown, init: ResponseInit = {}) {
  const response = NextResponse.json(data, init);
  response.headers.set("Cache-Control", "no-store, max-age=0");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("X-Content-Type-Options", "nosniff");
  return response;
}

export function checkRateLimit(
  request: Request,
  scope: string,
  { limit, windowMs }: RateLimitOptions,
) {
  const now = Date.now();
  const key = `${scope}:${clientAddress(request)}`;
  const current = rateLimitStore.get(key);
  const entry = !current || current.resetAt <= now
    ? { count: 1, resetAt: now + windowMs }
    : { count: current.count + 1, resetAt: current.resetAt };

  rateLimitStore.set(key, entry);

  if (rateLimitStore.size > 5_000) {
    for (const [storedKey, storedEntry] of rateLimitStore) {
      if (storedEntry.resetAt <= now) rateLimitStore.delete(storedKey);
    }
  }

  if (entry.count <= limit) return null;

  const retryAfter = Math.max(1, Math.ceil((entry.resetAt - now) / 1_000));
  return apiJson(
    { error: "rate_limit_exceeded" },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
}

export function rejectCrossSiteMutation(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "cross-site") {
    return apiJson({ error: "cross_site_request_blocked" }, { status: 403 });
  }

  const origin = request.headers.get("origin");
  if (!origin) return null;

  const requestOrigin = new URL(request.url).origin;
  const configuredOrigin = process.env.NEXT_PUBLIC_APP_URL;
  const allowedOrigins = new Set([requestOrigin, configuredOrigin].filter(Boolean));

  return allowedOrigins.has(origin)
    ? null
    : apiJson({ error: "invalid_origin" }, { status: 403 });
}

export function requireJsonRequest(request: Request) {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  return contentType.startsWith("application/json")
    ? null
    : apiJson({ error: "unsupported_media_type" }, { status: 415 });
}

export async function requireApiSession(
  permission?: Permission,
): Promise<{ session: AppSession; response: null } | { session: null; response: NextResponse }> {
  const session = await getCurrentSession();
  if (!session) {
    return { session: null, response: apiJson({ error: "unauthorized" }, { status: 401 }) };
  }

  if (permission && !hasPermission(session.role, permission)) {
    return { session: null, response: apiJson({ error: "forbidden" }, { status: 403 }) };
  }

  return { session, response: null };
}

export function reportServerError(context: string, error: unknown) {
  console.error(`[${context}]`, error instanceof Error ? error.message : "Unknown error");
}
