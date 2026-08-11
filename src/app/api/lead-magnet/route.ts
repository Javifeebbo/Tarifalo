import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Spanish mobile/landline numbers: optional +34 prefix, then 9 digits
// starting with 6, 7, 8 or 9. Kept in sync with the client-side check in
// LeadMagnetForm.tsx — the client check is for UX, this one is the real gate.
const PHONE_RE = /^(\+34\s?)?[6789]\d{8}$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const { name, email, phone, consent } = (body ?? {}) as {
    name?: unknown;
    email?: unknown;
    phone?: unknown;
    consent?: unknown;
  };

  if (typeof name !== "string" || name.trim().length < 3) {
    return NextResponse.json({ error: "Nombre inválido" }, { status: 400 });
  }
  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }
  if (typeof phone !== "string" || !PHONE_RE.test(phone.replace(/\s|-/g, ""))) {
    return NextResponse.json({ error: "Teléfono inválido" }, { status: 400 });
  }
  if (consent !== true) {
    return NextResponse.json({ error: "Debes aceptar la política de privacidad" }, { status: 400 });
  }

// Soft-dedupe scoped to this campaign only — an email that already exists
  // from /comparar or the newsletter must NOT block a first-time lead-magnet
  // signup (that was the original bug: the check matched any row with that
  // email regardless of source, so repeat testers/customers never got
  // inserted here at all).
  const existing = await sql`
    select id from leads
    where email = ${email.trim()} and source = 'lead_magnet' and campaign = 'guia-ahorro-luz'
    limit 1
  `;
  if (existing.length === 0) {
    await sql`
      insert into leads (source, email, name, phone, consent, campaign)
      values ('lead_magnet', ${email.trim()}, ${name.trim()}, ${phone.trim()}, true, 'guia-ahorro-luz')
    `;
  }

  return NextResponse.json({ ok: true });
}
