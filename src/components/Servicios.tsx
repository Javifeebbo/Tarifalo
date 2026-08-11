"use client";

import { motion, useReducedMotion } from "framer-motion";
import { staggerContainer, enterFade, SPRING } from "@/lib/animations";
import { IllustrativeBadge } from "./IllustrativeBadge";

const TARIFFS = [
  { name: "Luz", icon: "⚡", save: "Ahorra hasta 270€/año", cta: "Comparar Luz", illustrative: true, type: "luz" },
  { name: "Gas", icon: "🔥", save: "Ahorra hasta 180€/año", cta: "Comparar Gas", illustrative: true, type: "gas" },
  { name: "Luz + Gas", icon: "⭐", save: "Ahorra hasta 450€/año", cta: "Comparar Luz+Gas", illustrative: true, type: "luz_gas" },
  { name: "Solar", icon: "☀️", save: "Ahorro variable", cta: "Comparar Solar", illustrative: false, type: "solar" },
];

export function Servicios() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <section className="relative bg-grey-alt px-6 py-[120px] md:px-[50px]" id="servicios">
      <motion.div
        initial={prefersReducedMotion ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
        className="mx-auto mb-14 flex max-w-[1300px] flex-wrap items-end justify-between gap-8"
      >
        <motion.h2 variants={enterFade} className="font-sans text-[clamp(38px,5vw,60px)] font-extrabold text-navy">
          COMPARA Y AHORRA
        </motion.h2>
        <motion.p variants={enterFade} className="max-w-[340px] font-sans text-[15px] leading-[1.6] text-navy/65 md:text-right">
          Elige tu tarifa. Comparamos por ti en menos de un minuto.
        </motion.p>
      </motion.div>
      <motion.div
        initial={prefersReducedMotion ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
        className="mx-auto grid max-w-[1300px] grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4"
      >
        {TARIFFS.map((tariff) => (
          <motion.div
            key={tariff.name}
            variants={enterFade}
            whileHover={{ y: -12, transition: { duration: 0.4, ease: SPRING } }}
            className="relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-[22px] bg-card-navy p-6"
          >
            <div className="relative z-[2] flex items-start justify-between">
              <div>
                <div className="font-sans text-[10px] font-semibold uppercase tracking-[1.4px] text-cream/55">Tarifa</div>
                <div className="mt-1.5 font-sans text-xl font-semibold text-white">{tariff.name}</div>
              </div>
              <div className="text-2xl">{tariff.icon}</div>
            </div>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div
                className="absolute h-[80%] w-[80%] rounded-full"
                style={{ background: "radial-gradient(circle, rgba(252,239,216,0.14) 0%, rgba(252,239,216,0) 70%)" }}
              />
              <motion.div className="relative text-[96px]" whileHover={{ scale: 1.08 }} transition={{ duration: 0.4, ease: SPRING }}>
                {tariff.icon}
              </motion.div>
            </div>
            <div className="relative z-[2] flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-col items-start gap-1.5">
                <span className="font-sans text-sm font-medium text-cream-dim">{tariff.save}</span>
                {tariff.illustrative && <IllustrativeBadge />}
              </div>
              <a
                href={`/comparar?tarifa=${tariff.type}`}
                className="rounded-full bg-orange px-[22px] py-2.5 font-sans text-[13px] font-semibold text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-card-navy"
              >
                {tariff.cta}
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
