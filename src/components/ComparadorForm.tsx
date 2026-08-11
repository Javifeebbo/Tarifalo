"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { IllustrativeBadge } from "./IllustrativeBadge";

const TARIFF_OPTIONS = [
  { value: "luz", label: "Luz" },
  { value: "gas", label: "Gas" },
  { value: "luz_gas", label: "Luz + Gas" },
  { value: "solar", label: "Solar" },
] as const;

type TariffValue = (typeof TARIFF_OPTIONS)[number]["value"];

type ComparisonResult = {
  illustrative: boolean;
  disclaimer: string;
  tariffs: { label: string; monthlyPrice: number; illustrative: boolean }[];
  estimatedMonthlySaving: number | null;
};

function isTariffValue(value: string | null): value is TariffValue {
  return TARIFF_OPTIONS.some((t) => t.value === value);
}

export function ComparadorForm() {
  const params = useSearchParams();
  const preselected = params.get("tarifa");

  const [tariffType, setTariffType] = useState<TariffValue>(isTariffValue(preselected) ? preselected : "luz");
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
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-[560px] flex-col gap-4">
      <div>
        <label htmlFor="tariffType" className="mb-1.5 block font-sans text-sm font-semibold text-navy">
          Tarifa que te interesa
        </label>
        <select
          id="tariffType"
          value={tariffType}
          onChange={(e) => setTariffType(e.target.value as TariffValue)}
          className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 font-sans text-sm text-navy focus:border-orange focus:outline-none"
        >
          {TARIFF_OPTIONS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block font-sans text-sm font-semibold text-navy">
            Nombre
          </label>
          <input
            id="name"
            required
            minLength={2}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 font-sans text-sm text-navy focus:border-orange focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block font-sans text-sm font-semibold text-navy">
            Teléfono <span className="text-navy/40">(opcional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 font-sans text-sm text-navy focus:border-orange focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block font-sans text-sm font-semibold text-navy">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 font-sans text-sm text-navy focus:border-orange focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="postalCode" className="mb-1.5 block font-sans text-sm font-semibold text-navy">
            Código postal <span className="text-navy/40">(opcional)</span>
          </label>
          <input
            id="postalCode"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 font-sans text-sm text-navy focus:border-orange focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="monthlyBill" className="mb-1.5 block font-sans text-sm font-semibold text-navy">
            Factura mensual actual € <span className="text-navy/40">(opcional)</span>
          </label>
          <input
            id="monthlyBill"
            type="number"
            min={0}
            step="0.01"
            value={monthlyBill}
            onChange={(e) => setMonthlyBill(e.target.value)}
            className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 font-sans text-sm text-navy focus:border-orange focus:outline-none"
          />
        </div>
      </div>

      <label className="flex items-start gap-2.5 font-sans text-xs leading-relaxed text-navy/70">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5"
        />
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
        className="mt-2 rounded-full bg-orange px-10 py-3.5 font-sans text-[15px] font-semibold text-navy transition-transform duration-300 hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
      >
        {status === "loading" ? "Comparando…" : "Ver comparación de ejemplo"}
      </button>
    </form>
  );
}
