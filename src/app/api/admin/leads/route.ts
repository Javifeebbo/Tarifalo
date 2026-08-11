import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// Protected by middleware.ts (Basic Auth on /api/admin/*) — this route
// itself does no auth check, the gate happens before the request reaches it.
export async function GET() {
  const rows = await sql`
    select id, created_at, source, campaign, name, email, phone,
           tariff_type, postal_code, monthly_bill_estimate, consent
    from leads
    order by created_at desc
  `;

  return NextResponse.json({ leads: rows });
}
