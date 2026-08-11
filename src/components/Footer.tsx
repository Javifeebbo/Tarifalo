"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Algo ha ido mal, inténtalo de nuevo.");
        setStatus("error");
        return;
      }
      setStatus("success");
      setEmail("");
    } catch {
      setError("No hemos podido conectar. Inténtalo de nuevo.");
      setStatus("error");
    }
  }

  return (
    <footer className="border-t border-white/10 bg-navy px-6 py-14 md:px-[50px]">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mx-auto mb-12 flex max-w-[1300px] flex-wrap items-center justify-between gap-6 border-b border-white/10 pb-12"
      >
        <h3 className="flex max-w-[420px] items-start gap-2.5 font-sans text-[clamp(20px,2.6vw,28px)] font-bold text-cream">
          <span aria-hidden="true">🔔</span>
          No te pierdas ninguna bajada de precio
        </h3>
        {status === "success" ? (
          <p className="font-sans text-sm font-semibold text-orange">¡Listo! Te avisaremos por email.</p>
        ) : (
          <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <div className="flex flex-wrap gap-2.5">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu correo electrónico"
                aria-label="Correo electrónico"
                className="min-w-[240px] flex-1 rounded-full border border-white/15 bg-white/[0.06] px-5 py-3.5 font-sans text-sm text-white placeholder:text-cream/45 focus:border-orange focus:outline-none"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="whitespace-nowrap rounded-full bg-orange px-10 py-3.5 font-sans text-[15px] font-semibold text-navy transition-transform duration-300 hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
              >
                {status === "loading" ? "Enviando…" : "Avísame"}
              </button>
            </div>
            {error && <p className="font-sans text-xs text-red-400">{error}</p>}
            <p className="font-sans text-xs text-cream-dim/60">
              Al enviar aceptas nuestra{" "}
              <a href="/politica-privacidad" className="underline hover:text-cream-dim">
                política de privacidad
              </a>
              .
            </p>
          </form>
        )}
      </motion.div>
      <div className="mx-auto flex max-w-[1300px] flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <a href="/" className="font-sans text-lg font-bold lowercase text-cream">
            tarífalo
          </a>
          <p className="mt-1 font-sans text-sm text-cream-dim">Comparamos para que tú ahorres.</p>
        </div>
        <div className="flex items-center gap-6">
          <a href="/" className="font-sans text-xs text-cream-dim/70 underline hover:text-cream-dim">
            Inicio
          </a>
  <a href="/comparar" className="font-sans text-xs text-cream-dim/70 underline hover:text-cream-dim">
            Comparar
          </a>
          <a href="/guia-ahorro-luz" className="font-sans text-xs text-cream-dim/70 underline hover:text-cream-dim">
            Guía gratis
          </a>
          <a href="/politica-privacidad" className="font-sans text-xs text-cream-dim/70 underline hover:text-cream-dim">
            Política de privacidad
          </a>
          <p className="font-sans text-xs text-cream-dim/70">© 2026 Tarífalo. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
