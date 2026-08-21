import { SignJWT, jwtVerify } from "jose";

const encoder = new TextEncoder();

// Throws rather than falling back to an empty-string secret. Signing (or
// verifying) sessions with "" would mean anyone could forge a valid token —
// including one with is_admin-granting access — the moment this env var is
// ever unset (a misconfigured preview deploy, a new environment, etc).
function secret() {
  const value = process.env.JWT_SECRET;
  if (!value) {
    throw new Error("JWT_SECRET is not set. Refusing to sign or verify sessions with an empty secret.");
  }
  return encoder.encode(value);
}

export interface SessionPayload {
  userId: number;
  email: string;
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return { userId: payload.userId as number, email: payload.email as string };
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = "cvc_session";
