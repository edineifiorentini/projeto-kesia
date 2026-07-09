import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { Role } from "./permissions";

export type AppSession = {
  userId: string;
  businessId: string | null;
  role: Role;
  locale: "pt-BR" | "en-US" | "es-ES";
};

const encoder = new TextEncoder();
export const SESSION_COOKIE_NAME = "salon_session";

function getSecret() {
  return encoder.encode(process.env.AUTH_SECRET ?? "development-only-secret");
}

export async function createSessionToken(session: AppSession) {
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSecret());
}

export async function verifySessionToken(token: string) {
  const result = await jwtVerify(token, getSecret());
  return result.payload as unknown as AppSession;
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
