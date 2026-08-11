import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TARIFF_TYPES = ["luz", "gas", "luz_gas", "solar"] as const;
type TariffType = (typeof TARIFF_TYPES)[number];

function isTariffType(value: unknown): value is TariffType {
  return typeof value === "string" && (TARIFF_TYPES as readonly string[]).includes(value);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const { name, email, phone, tariffType, postalCode, monthlyBillEstimate, consent } = (body ?? {}) as {
    name?: unknown;
    email?: unknown;
    phone?: unknown;
    tariffType?: unknown;
    postalCode?: unknown;
    monthlyBillEstimate?: unknown;
    consent?: unknown;
  };

  if (typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json({ error: "Nombre inválido" }, { status: 400 });
  }
  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }
  if (!isTariffType(tariffType)) {
    return NextResponse.json({ error: "Tipo de tarifa inválido" }, { status: 400 });
  }
  if (consent !== true) {
    return NextResponse.json({ error: "Debes aceptar la política de privacidad" }, { status: 400 });
  }

  const billEstimate =
    typeof monthlyBillEstimate === "number" && Number.isFinite(monthlyBillEstimate) && monthlyBillEstimate > 0
      ? monthlyBillEstimate
      : null;

  await sql`
    insert into leads (source, email, name, phone, tariff_type, postal_code, monthly_bill_estimate, consent)
    values (
      'comparador',
      ${email},
      ${name.trim()},
      ${typeof phone === "string" && phone.trim() ? phone.trim() : null},
      ${tariffType},
      ${typeof postalCode === "string" && postalCode.trim() ? postalCode.trim() : null},
      ${billEstimate},
      true
    )
  `;

  const tariffs = await sql`
    select label, monthly_price, illustrative
    from example_tariffs
    where tariff_type = ${tariffType}
    order by monthly_price asc
  `;

  const cheapest = tariffs[0] ? Number(tariffs[0].monthly_price) : null;
  const estimatedMonthlySaving = billEstimate !== null && cheapest !== null ? Math.max(0, billEstimate - cheapest) : null;

  return NextResponse.json({
    ok: true,
    illustrative: true,
    disclaimer:
      "Estos resultados son un ejemplo ilustrativo con tarifas de muestra, no una oferta real de ninguna compañía. Te contactaremos con una comparación verificada.",
    tariffs: tariffs.map((t) => ({ label: t.label, monthlyPrice: Number(t.monthly_price), illustrative: t.illustrative })),
    estimatedMonthlySaving,
  });
}
