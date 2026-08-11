import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { routeLead, type LeadCriteria } from "@/lib/matching";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TARIFF_TYPES = ["luz", "gas", "luz_gas", "solar"] as const;
type TariffType = (typeof TARIFF_TYPES)[number];

const CUSTOMER_TYPES = ["particular", "empresa"] as const;
type CustomerType = (typeof CUSTOMER_TYPES)[number];

function isTariffType(value: unknown): value is TariffType {
  return typeof value === "string" && (TARIFF_TYPES as readonly string[]).includes(value);
}

function isCustomerType(value: unknown): value is CustomerType {
  return typeof value === "string" && (CUSTOMER_TYPES as readonly string[]).includes(value);
}

// Normalizes any optional free-text/select field: trims, and turns an empty
// string into null so we don't store "" in Postgres for "not answered".
function optionalText(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const {
    name,
    email,
    phone,
    tariffType,
    postalCode,
    monthlyBillEstimate,
    consent,
    customerType,
    householdSize,
    surfaceM2,
    currentCompany,
  } = (body ?? {}) as {
    name?: unknown;
    email?: unknown;
    phone?: unknown;
    tariffType?: unknown;
    postalCode?: unknown;
    monthlyBillEstimate?: unknown;
    consent?: unknown;
    customerType?: unknown;
    householdSize?: unknown;
    surfaceM2?: unknown;
    currentCompany?: unknown;
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
  // Optional, but if present must be one of the two known values — silently
  // ignoring a typo'd value would be worse than rejecting it here.
  if (customerType !== undefined && customerType !== "" && !isCustomerType(customerType)) {
    return NextResponse.json({ error: "Tipo de cliente inválido" }, { status: 400 });
  }
  if (consent !== true) {
    return NextResponse.json({ error: "Debes aceptar la política de privacidad" }, { status: 400 });
  }

  const billEstimate =
    typeof monthlyBillEstimate === "number" && Number.isFinite(monthlyBillEstimate) && monthlyBillEstimate > 0
      ? monthlyBillEstimate
      : null;

  const [lead] = await sql`
    insert into leads (
      source, email, name, phone, tariff_type, postal_code, monthly_bill_estimate, consent,
      customer_type, household_size, surface_m2, current_company
    )
    values (
      'comparador',
      ${email},
      ${name.trim()},
      ${typeof phone === "string" && phone.trim() ? phone.trim() : null},
      ${tariffType},
      ${optionalText(postalCode)},
      ${billEstimate},
      true,
      ${isCustomerType(customerType) ? customerType : null},
      ${optionalText(householdSize)},
      ${optionalText(surfaceM2)},
      ${optionalText(currentCompany)}
    )
    returning id
  `;

  const criteria: LeadCriteria = {
    tariffType,
    customerType: isCustomerType(customerType) ? customerType : null,
    householdSize: optionalText(householdSize),
    surfaceM2: optionalText(surfaceM2),
    postalCode: optionalText(postalCode),
    currentCompany: optionalText(currentCompany),
  };

  const { ranked, winnerCompanyName } = await routeLead(lead.id, criteria);

  const cheapest = ranked[0] ? ranked[0].monthlyPrice : null;
  const estimatedMonthlySaving = billEstimate !== null && cheapest !== null ? Math.max(0, billEstimate - cheapest) : null;

  return NextResponse.json({
    ok: true,
    illustrative: true,
    disclaimer:
      "Estos resultados son un ejemplo ilustrativo con tarifas y campañas de muestra, no una oferta real de ninguna compañía. Te contactaremos con una comparación verificada.",
    tariffs: ranked.map((t) => ({ label: `${t.companyName} — ${t.label}`, monthlyPrice: t.monthlyPrice, illustrative: t.illustrative })),
    estimatedMonthlySaving,
    routedTo: winnerCompanyName,
  });
}
