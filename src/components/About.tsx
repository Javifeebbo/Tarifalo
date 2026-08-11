"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { staggerContainer, enterFade } from "@/lib/animations";

const STATS = [
  { icon: "💰", num: "450€", label: "Ahorro medio anual" },
  { icon: "⏱️", num: "1 min", label: "Para comparar" },
  { icon: "🏢", num: "10+", label: "Compañías comparadas" },
];

export function About() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <section className="relative bg-cream px-6 py-[130px] text-navy md:px-[60px]" id="about">
      <div className="mx-auto grid max-w-[1200px] items-center gap-[70px] md:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={prefersReducedMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
        >
          <motion.div
            variants={enterFade}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-navy/15 bg-navy/[0.07] px-[18px] py-2 font-sans text-[11px] font-semibold uppercase tracking-[1.5px] text-navy"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-orange" />
            Ahorro real, sin letra pequeña
          </motion.div>
          <motion.h2 variants={enterFade} className="font-sans text-[clamp(38px,4.6vw,58px)] font-extrabold leading-[1.08] text-navy">
            COMPARA GRATIS.
            <br />
            AHORRA DE VERDAD.
          </motion.h2>
          <motion.p variants={enterFade} className="mt-6 max-w-[520px] font-sans text-base leading-[1.7] text-navy/75">
            En Tarífalo comparamos las mejores tarifas de luz y gas del mercado en menos de un minuto. Sin
            documentos, sin facturas, sin compromiso.
          </motion.p>
          <motion.div
            variants={enterFade}
            className="mt-14 grid max-w-[560px] grid-cols-1 border-y border-navy/[0.18] sm:grid-cols-3"
          >
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={
                  i < STATS.length - 1
                    ? "border-b border-navy/[0.18] px-4 py-8 sm:border-b-0 sm:border-r"
                    : "px-4 py-8"
                }
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl leading-none" aria-hidden="true">
                    {stat.icon}
                  </span>
                  <div className="font-sans text-[36px] font-extrabold text-navy">{stat.num}</div>
                </div>
                <div className="mt-2 font-sans text-[11px] font-semibold uppercase tracking-[1.2px] text-navy/60">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="order-first overflow-hidden rounded-[26px] shadow-[0_30px_60px_rgba(0,48,73,0.25)] md:order-none"
        >
          <Image
            src="/about-photo.png"
            alt="Persona relajada comparando tarifas desde casa"
            width={800}
            height={800}
            className="h-full w-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
