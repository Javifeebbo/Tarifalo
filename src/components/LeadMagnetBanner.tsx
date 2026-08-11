"use client";

import { motion, useReducedMotion } from "framer-motion";
import { enterFade, staggerContainer } from "@/lib/animations";

export function LeadMagnetBanner() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <section className="bg-navy px-6 py-[100px] md:px-[50px]">
      <motion.div
        initial={prefersReducedMotion ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
        className="mx-auto flex max-w-[1300px] flex-col items-center gap-10 rounded-[22px] bg-card-navy px-8 py-12 md:flex-row md:justify-between md:px-14"
      >
        <div className="max-w-[560px] text-center md:text-left">
          <motion.div
            variants={enterFade}
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-orange px-[18px] py-2 font-sans text-[11px] font-semibold uppercase tracking-[1.5px] text-navy"
          >
            🎁 Guía gratuita en PDF
          </motion.div>
          <motion.h2 variants={enterFade} className="font-sans text-[clamp(26px,3.4vw,38px)] font-extrabold leading-[1.15] text-white">
            Descubre cómo ahorrar en tu factura de la luz
          </motion.h2>
          <motion.p variants={enterFade} className="mt-4 font-sans text-[15px] leading-[1.7] text-cream-dim/90">
            Te enviamos gratis una guía con 7 trucos reales para reducir tu factura este mismo mes. Solo
            necesitamos tu nombre, teléfono y email.
          </motion.p>
          <motion.div variants={enterFade}>
            <a
              href="/guia-ahorro-luz"
              className="mt-7 inline-block rounded-full bg-orange px-10 py-3.5 font-sans text-[15px] font-semibold text-navy transition-transform duration-300 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-card-navy"
            >
              Descargar guía gratis
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="relative flex h-[190px] w-[190px] flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy"
        >
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(circle, #004568 0%, rgba(0,69,104,0) 70%)" }}
          />
          <span className="relative text-[76px]" aria-hidden="true">
            📄
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
