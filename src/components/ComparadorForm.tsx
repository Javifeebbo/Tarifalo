"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { IllustrativeBadge } from "./IllustrativeBadge";

const TARIFF_OPTIONS = [
  { value: "luz", label: "Luz", icon: "⚡" },
  { value: "gas", label: "Gas", icon: "🔥" },
  { value: "luz_gas", label: "Luz + Gas", icon: "⭐" },
  { value: "solar", label: "Solar", icon: "☀️" },
] as const;

type TariffValue = (typeof TARIFF_OPTIONS)[number]["value"];

const CUSTOMER_TYPE_OPTIONS = [
  { value: "particular", label: "Particular" },
  { value: "empresa", label: "Empresa" },
] as const;

const HOUSEHOLD_SIZE_OPTIONS = ["1", "2", "3", "4", "5+"];
const SURFACE_OPTIONS = ["Menos de 60 m²", "60–90 m²", "90–120 m²", "Más de 120 m²"];

type ComparisonResult = {
  illustrative: boolean;
  disclaimer: string;
  tariffs: { label: string; monthlyPrice: number; illustrative: boolean }[];
  estimatedMonthlySaving: number | null;
  routedTo: string | null;
};

function isTariffValue(value: string | null): value is TariffValue {
  return TARIFF_OPTIONS.some((t) => t.value === value);
}

export function ComparadorForm() {
  const params = useSearchParams();
  const preselected = params.get("tarifa");

  const [tariffType, setTariffType] = useState<TariffValue>(isTariffValue(preselected) ? preselected : "luz");
  const [customerType, setCustomerType] = useState<"particular" | "empresa">("particular");
  const [householdSize, setHouseholdSize] = useState("");
  const [surfaceM2, setSurfaceM2] = useState("");
  const [currentCompany, setCurrentCompany] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [monthlyBill, setMonthlyBill] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ComparisonResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const monthlyBillEstimate = monthlyBill.trim() ? Number(monthlyBill) : undefined;

    try {
      const res = await fetch("/api/comparar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          tariffType,
          postalCode: postalCode || undefined,
          monthlyBillEstimate,
          consent,
          customerType,
          householdSize: householdSize || undefined,
          surfaceM2: surfaceM2 || undefined,
          currentCompany: currentCompany || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Algo ha ido mal, inténtalo de nuevo.");
        setStatus("error");
        return;
      }
      setResult(data);
      setStatus("idle");
    } catch {
      setError("No hemos podido conectar. Inténtalo de nuevo.");
      setStatus("error");
    }
  }

  if (result) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-[560px]">
        <div className="mb-6 flex items-center gap-3">
          <h2 className="font-sans text-2xl font-bold text-navy">Tu comparación de ejemplo</h2>
          <IllustrativeBadge />
        </div>
        <p className="mb-6 font-sans text-sm leading-relaxed text-navy/70">{result.disclaimer}</p>
        <div className="flex flex-col gap-3">
          {result.tariffs.map((t) => (
            <div key={t.label} className="flex items-center justify-between rounded-2xl bg-card-navy px-6 py-4">
              <span className="font-sans font-semibold text-white">{t.label}</span>
              <span className="font-sans text-lg font-bold text-cream">{t.monthlyPrice.toFixed(2)}€/mes</span>
            </div>
          ))}
        </div>
        {result.estimatedMonthlySaving !== null && (
          <div className="mt-6 rounded-2xl bg-orange/10 px-6 py-4 text-center">
            <div className="font-sans text-sm text-navy/70">Ahorro mensual estimado (ejemplo)</div>
            <div className="font-sans text-3xl font-extrabold text-orange">{result.estimatedMonthlySaving.toFixed(2)}€</div>
          </div>
        )}
        <p className="mt-6 text-center font-sans text-sm text-navy/60">
          Hemos guardado tus datos — te contactaremos con una comparación real verificada.
        </p>
        {result.routedTo && (
          <p className="mt-2 text-center font-sans text-xs text-navy/40">
            Motor de reparto interno (demo): este lead se asignaría a {result.routedTo}.
          </p>
        )}
      </motion.div>
    );
  }

  const selectClass =
    "w-full rounded-xl border border-navy/15 bg-white px-4 py-3 font-sans text-sm text-navy focus:border-orange focus:outline-none";
  const labelClass = "mb-1.5 block font-sans text-sm font-semibold text-navy";

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-[640px] flex-col gap-5">
      {/* Tabs de tarifa — mismo patrón que /comparador/{luz,gas,...} en tarifalo.com */}
      <div className="flex flex-wrap gap-2">
        {TARIFF_OPTIONS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTariffType(t.value)}
            className={
              tariffType === t.value
                ? "flex items-center gap-1.5 rounded-full bg-orange px-5 py-2.5 font-sans text-[13px] font-semibold text-navy"
                : "flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 font-sans text-[13px] font-semibold text-navy/55"
            }
          >
            <span aria-hidden="true">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Tipo de cliente</label>
            <div className="flex gap-2">
              {CUSTOMER_TYPE_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCustomerType(c.value)}
                  className={
                    customerType === c.value
                      ? "flex-1 rounded-xl bg-navy px-4 py-3 font-sans text-sm font-semibold text-white"
                      : "flex-1 rounded-xl border border-navy/15 bg-white px-4 py-3 font-sans text-sm text-navy/60"
                  }
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="currentCompany" className={labelClass}>
              Compañía actual <span className="text-navy/40">(opcional)</span>
            </label>
            <input
              id="currentCompany"
              value={currentCompany}
              onChange={(e) => setCurrentCompany(e.target.value)}
              placeholder="Ej. Endesa, Iberdrola…"
              className={selectClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="householdSize" className={labelClass}>
              Nº de personas <span className="text-navy/40">(opcional)</span>
            </label>
            <select id="householdSize" value={householdSize} onChange={(e) => setHouseholdSize(e.target.value)} className={selectClass}>
              <option value="">Selecciona…</option>
              {HOUSEHOLD_SIZE_OPTIONS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="surfaceM2" className={labelClass}>
              Superficie <span className="text-navy/40">(opcional)</span>
            </label>
            <select id="surfaceM2" value={surfaceM2} onChange={(e) => setSurfaceM2(e.target.value)} className={selectClass}>
              <option value="">Selecciona…</option>
              {SURFACE_OPTIONS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="h-px bg-navy/10" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelClass}>
              Nombre
            </label>
            <input id="name" required minLength={2} value={name} onChange={(e) => setName(e.target.value)} className={selectClass} />
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>
              Teléfono <span className="text-navy/40">(opcional)</span>
            </label>
            <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={selectClass} />
          </div>
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={selectClass} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="postalCode" className={labelClass}>
              Código postal <span className="text-navy/40">(opcional)</span>
            </label>
            <input id="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className={selectClass} />
          </div>
          <div>
            <label htmlFor="monthlyBill" className={labelClass}>
              Factura mensual actual € <span className="text-navy/40">(opcional)</span>
            </label>
            <input
              id="monthlyBill"
              type="number"
              min={0}
              step="0.01"
              value={monthlyBill}
              onChange={(e) => setMonthlyBill(e.target.value)}
              className={selectClass}
            />
          </div>
        </div>

        <label className="flex items-start gap-2.5 font-sans text-xs leading-relaxed text-navy/70">
          <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
          Acepto que Tarífalo guarde estos datos para contactarme con una comparación de tarifas, según la{" "}
          <a href="/politica-privacidad" className="underline hover:text-navy" target="_blank" rel="noopener noreferrer">
            política de privacidad
          </a>
          .
        </label>

        {error && <p className="font-sans text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-orange px-10 py-3.5 font-sans text-[15px] font-semibold text-navy transition-transform duration-300 hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        >
          {status === "loading" ? "Comparando…" : "Ver comparación de ejemplo"}
        </button>
      </div>
    </form>
  );
}
