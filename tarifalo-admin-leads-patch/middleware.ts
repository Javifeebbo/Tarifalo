import { NextRequest, NextResponse } from "next/server";

/**
 * Basic Auth gate for /admin and /api/admin. This is deliberately simple
 * (no session, no user table) — it's a single internal tool for one or two
 * people, not a multi-user product surface. Credentials come from env vars
 * so nothing is hardcoded: set ADMIN_USER / ADMIN_PASSWORD in Vercel
 * (Project → Settings → Environment Variables) and in .env.local for
 * local dev. If either is unset, the route is locked (fails closed).
 */
export function middleware(request: NextRequest) {
  const expectedUser = process.env.ADMIN_USER;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUser || !expectedPassword) {
    return new NextResponse("Panel de administración no configurado (faltan ADMIN_USER/ADMIN_PASSWORD).", {
      status: 503,
    });
  }

  const authHeader = request.headers.get("authorization");

  if (authHeader) {
    const [scheme, encoded] = authHeader.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = Buffer.from(encoded, "base64").toString("utf-8");
      const separatorIndex = decoded.indexOf(":");
      const user = decoded.slice(0, separatorIndex);
      const password = decoded.slice(separatorIndex + 1);

      if (user === expectedUser && password === expectedPassword) {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse("Autenticación requerida.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Tarífalo Admin"' },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
