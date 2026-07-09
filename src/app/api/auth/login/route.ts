import { NextResponse } from "next/server";
import {
  createSessionToken,
  demoSession,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/session";
import { loginSchema } from "@/lib/validation/schemas";

const adminEmail = process.env.ADMIN_EMAIL ?? "edineif@gmail.com";
const adminPassword = process.env.ADMIN_PASSWORD ?? "@135LuccaDutra";

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const { email, password } = parsed.data;

  if (email !== adminEmail || password !== adminPassword) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const token = await createSessionToken(demoSession);
  const response = NextResponse.json({
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
