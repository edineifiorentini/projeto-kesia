import { timingSafeEqual } from "node:crypto";
import { compare } from "bcryptjs";
import {
  createSessionToken,
  demoSession,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/session";
import { loginSchema } from "@/lib/validation/schemas";
import {
  apiJson,
  checkRateLimit,
  rejectCrossSiteMutation,
  requireJsonRequest,
} from "@/lib/security/api";

function constantTimeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

async function passwordMatches(password: string) {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (hash) return compare(password, hash);

  const configuredPassword = process.env.ADMIN_PASSWORD;
  return configuredPassword ? constantTimeEqual(password, configuredPassword) : false;
}

export async function POST(request: Request) {
  const rateLimited = checkRateLimit(request, "admin-login", {
    limit: 5,
    windowMs: 15 * 60 * 1_000,
  });
  if (rateLimited) return rateLimited;

  const crossSite = rejectCrossSiteMutation(request);
  if (crossSite) return crossSite;

  const invalidType = requireJsonRequest(request);
  if (invalidType) return invalidType;

  const payload = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(payload);

  if (!parsed.success) {
    return apiJson({ error: "invalid_payload" }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (!adminEmail || (!process.env.ADMIN_PASSWORD_HASH && !process.env.ADMIN_PASSWORD)) {
    return apiJson({ error: "authentication_not_configured" }, { status: 503 });
  }

  const emailMatches = constantTimeEqual(email.trim().toLowerCase(), adminEmail);
  const validPassword = await passwordMatches(password);
  if (!emailMatches || !validPassword) {
    return apiJson({ error: "invalid_credentials" }, { status: 401 });
  }

  const token = await createSessionToken(demoSession);
  const response = apiJson({
    user: {
      id: demoSession.userId,
      businessId: demoSession.businessId,
      role: demoSession.role,
      locale: demoSession.locale,
    },
  });

  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
