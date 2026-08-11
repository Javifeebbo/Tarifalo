import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// Without this, Next.js treats a GET route with no request-time APIs as
// static and Vercel's edge cache serves a stale snapshot indefinitely
// (confirmed via x-vercel-cache: HIT) — new leads would insert fine but
// never show up here. force-dynamic makes every request re-query the DB.
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Protected by middleware.ts (Basic Auth on /api/admin/*) — this route
// itself does no auth check, the gate happens before the request reaches it.
export async function GET() {
  const rows = await sql`
    select id, created_at, source, campaign, name, email, phone,
           tariff_type, postal_code, monthly_bill_estimate, consent
    from leads
    order by created_at desc
  `;

  return NextResponse.json(
    { leads: rows },
    { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
  );
}
