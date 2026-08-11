import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const { email, consent } = (body ?? {}) as { email?: unknown; consent?: unknown };

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }
  if (consent !== true) {
    return NextResponse.json({ error: "Debes aceptar recibir comunicaciones" }, { status: 400 });
  }

  await sql`
    insert into leads (source, email, consent)
    values ('newsletter', ${email}, true)
  `;

  return NextResponse.json({ ok: true });
}
