"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { enterFade, staggerContainer } from "@/lib/animations";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(\+34\s?)?[6789]\d{8}$/;

const TIPS = [
  { icon: "🔌", label: "Potencia contratada" },
  { icon: "🌙", label: "Horas valle" },
  { icon: "🔥", label: "Consumo fantasma" },
  { icon: "🔄", label: "Comparar cada año" },
];

export function LeadMagnetForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const nameValid = name.trim().length >= 3;
  const phoneValid = PHONE_RE.test(phone.replace(/\s|-/g, ""));
  const emailValid = EMAIL_RE.test(email.trim());
  const allValid = nameValid && phoneValid && emailValid && consent;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, phone: true, email: true, consent: true });
    if (!allValid) return;

    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, consent }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Algo ha ido mal, inténtalo de nuevo.");
        setStatus("error");
        return;
      }
      setStatus("success");

      // Descarga automática de la guía tras el registro correcto.
      const a = document.createElement("a");
      a.href = "/tarifalo-guia-ahorro-luz.pdf";
      a.download = "Tarifalo-Guia-Ahorro-Luz.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      setError("No hemos podido conectar. Inténtalo de nuevo.");
      setStatus("error");
    }
  }

  return (
    <section className="relative bg-navy px-6 py-[130px] md:px-[60px]" id="guia-ahorro-luz">
      <div className="mx-auto grid max-w-[1200px] items-center gap-[70px] md:grid-cols-[1fr_0.85fr]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
        >
          <motion.div
            variants={enterFade}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-orange px-[18px] py-2 font-sans text-[11px] font-semibold uppercase tracking-[1.5px] text-navy"
          >
            🎁 Guía gratuita en PDF
          </motion.div>

          <motion.h1
            variants={enterFade}
            className="font-sans text-[clamp(32px,4.6vw,52px)] font-extrabold leading-[1.08] text-white"
          >
            Descubre cómo ahorrar en tu factura de la luz
          </motion.h1>

          <motion.p variants={enterFade} className="mt-5 max-w-[480px] font-sans text-base leading-[1.7] text-cream-dim/90">
            Te enviamos gratis una guía en PDF con 7 trucos reales para reducir tu factura este mismo
            mes. Solo tienes que dejarnos tus datos.
          </motion.p>

          <motion.div variants={enterFade} className="mt-8 flex flex-wrap gap-2.5">
            {TIPS.map((tip) => (
              <span
                key={tip.label}
                className="inline-flex items-center gap-1.5 rounded-full bg-card-navy px-4 py-2 font-sans text-[13px] font-medium text-cream-dim"
              >
                <span aria-hidden="true">{tip.icon}</span>
                {tip.label}
              </span>
            ))}
          </motion.div>

          <motion.form
            variants={enterFade}
            onSubmit={handleSubmit}
            className="mt-10 flex max-w-[480px] flex-col gap-3.5 rounded-2xl bg-cream p-7"
            noValidate
          >
            <div>
              <label htmlFor="lm-name" className="mb-1.5 block font-sans text-sm font-semibold text-navy">
                Nombre y apellidos
              </label>
              <input
                id="lm-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 font-sans text-sm text-navy focus:border-orange focus:outline-none"
              />
              {touched.name && !nameValid && (
                <p className="mt-1 font-sans text-xs text-red-600">Escribe tu nombre y apellidos.</p>
              )}
            </div>

            <div>
              <label htmlFor="lm-phone" className="mb-1.5 block font-sans text-sm font-semibold text-navy">
                Teléfono
              </label>
              <input
                id="lm-phone"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 font-sans text-sm text-navy focus:border-orange focus:outline-none"
              />
              {touched.phone && !phoneValid && (
                <p className="mt-1 font-sans text-xs text-red-600">Introduce un teléfono válido (9 dígitos).</p>
              )}
            </div>

            <div>
              <label htmlFor="lm-email" className="mb-1.5 block font-sans text-sm font-semibold text-navy">
                Email
              </label>
              <input
                id="lm-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 font-sans text-sm text-navy focus:border-orange focus:outline-none"
              />
              {touched.email && !emailValid && (
                <p className="mt-1 font-sans text-xs text-red-600">Introduce un email válido.</p>
              )}
            </div>

            <label className="flex items-start gap-2.5 font-sans text-xs leading-relaxed text-navy/70">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                onBlur={() => setTouched((t) => ({ ...t, consent: true }))}
                className="mt-0.5"
              />
              Acepto que Tarífalo guarde estos datos para enviarme la guía, según la{" "}
              <a href="/politica-privacidad" className="underline hover:text-navy" target="_blank" rel="noopener noreferrer">
                política de privacidad
              </a>
              .
            </label>
            {touched.consent && !consent && (
              <p className="-mt-2 font-sans text-xs text-red-600">Debes aceptar la política de privacidad.</p>
            )}

            {status === "error" && error && <p className="font-sans text-sm text-red-600">{error}</p>}
            {status === "success" && (
              <p className="font-sans text-sm font-semibold text-[#1e9e52]">¡Listo! Tu guía se está descargando.</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-1 rounded-full bg-orange px-10 py-3.5 font-sans text-[15px] font-semibold text-navy transition-transform duration-300 hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            >
              {status === "loading" ? "Enviando…" : "Descargar guía gratis"}
            </button>

            <p className="font-sans text-[11px] text-navy/50">Al enviar aceptas nuestra política de privacidad. Sin spam.</p>
          </motion.form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-card-navy"
        >
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(circle, #004568 0%, rgba(0,69,104,0) 70%)" }}
          />
          <div className="relative flex flex-col items-center justify-center rounded-full bg-orange px-10 py-10 text-center text-navy">
            <span className="font-sans text-[44px] font-extrabold leading-none">450€</span>
            <span className="mt-2 font-sans text-sm font-semibold">de ahorro al año</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
