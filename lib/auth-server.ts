import { SignJWT, jwtVerify } from "jose";

const encoder = new TextEncoder();
const secret = () => encoder.encode(process.env.JWT_SECRET ?? "");

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
