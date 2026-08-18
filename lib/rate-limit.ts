import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function rateLimit(
  req: NextRequest,
  routeKey: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const ip = getClientIp(req);
  const key = `${routeKey}:${ip}`;

  const rows = await sql`
    INSERT INTO rate_limits (key, count, window_start)
    VALUES (${key}, 1, now())
    ON CONFLICT (key) DO UPDATE SET
      count = CASE
        WHEN rate_limits.window_start < now() - (${windowSeconds} || ' seconds')::interval THEN 1
        ELSE rate_limits.count + 1
      END,
      window_start = CASE
        WHEN rate_limits.window_start < now() - (${windowSeconds} || ' seconds')::interval THEN now()
        ELSE rate_limits.window_start
      END
    RETURNING count
  `;

  const count = rows[0]?.count ?? 1;
  return { allowed: count <= limit, remaining: Math.max(0, limit - count) };
}

export function rateLimitResponse(): NextResponse {
  return NextResponse.json(
    { ok: false, error: "Too many attempts. Please wait a bit and try again." },
    { status: 429 }
  );
}
