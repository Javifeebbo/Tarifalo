"use client";

import { motion, useReducedMotion } from "framer-motion";

export function Manifesto() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <section className="relative overflow-hidden bg-navy px-6 py-[110px]">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 select-none text-[220px] leading-none opacity-[0.05] sm:text-[320px]"
      >
        💬
      </span>
      <motion.div
        className="relative mx-auto max-w-[780px] text-center"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="mx-auto mb-11 h-px w-8 bg-orange" />
        <p className="font-sans text-[clamp(22px,3.5vw,38px)] font-light leading-snug text-cream">
          &ldquo;No creemos que ahorrar en tu factura deba costarte una tarde rellenando formularios. Comparamos por
          ti, en un minuto, sin letra pequeña.&rdquo;
        </p>
        <p className="mt-7 font-sans text-[11px] tracking-[0.3em] text-orange">— EQUIPO TARÍFALO</p>
      </motion.div>
    </section>
  );
}
