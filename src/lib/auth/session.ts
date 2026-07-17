import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { hasPermission, type Role } from "./permissions";

export type AppSession = {
  userId: string;
  businessId: string | null;
  role: Role;
  locale: "pt-BR" | "en-US" | "es-ES";
};

const encoder = new TextEncoder();
export const SESSION_COOKIE_NAME =
  process.env.NODE_ENV === "production" ? "__Host-salon_session" : "salon_session";
const SESSION_ISSUER = "kesia-dutra-admin";
const SESSION_AUDIENCE = "kesia-dutra-dashboard";

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must contain at least 32 characters.");
  }

  return encoder.encode(secret);
}

export async function createSessionToken(session: AppSession) {
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(SESSION_ISSUER)
    .setAudience(SESSION_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSecret());
}

export async function verifySessionToken(token: string) {
  const result = await jwtVerify(token, getSecret(), {
    algorithms: ["HS256"],
    issuer: SESSION_ISSUER,
    audience: SESSION_AUDIENCE,
  });
  const payload = result.payload as Partial<AppSession>;

  if (
    typeof payload.userId !== "string" ||
    (payload.businessId !== null && typeof payload.businessId !== "string") ||
    typeof payload.role !== "string" ||
    !["pt-BR", "en-US", "es-ES"].includes(payload.locale ?? "")
  ) {
    throw new Error("Invalid session payload.");
  }

  // This also rejects unknown roles without duplicating the role list.
  hasPermission(payload.role as Role, "appointments:manage");

  return payload as AppSession;
}

export async function getCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

export const demoSession: AppSession = {
  userId: "demo-owner",
  businessId: "kesia-dutra-cabeleireira",
  role: "business_owner",
  locale: "pt-BR",
};
