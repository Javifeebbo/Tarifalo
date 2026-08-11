"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SPRING } from "@/lib/animations";

const STEPS = [
  {
    icon: "📝",
    statNum: "1",
    statLabel: "formulario",
    number: "01",
    title: "Rellena un solo formulario",
    text: "Cuéntanos tu consumo actual en menos de un minuto, sin necesidad de subir facturas.",
    reverse: false,
  },
  {
    icon: "⚡",
    statNum: "<1 min",
    statLabel: "respuesta",
    number: "02",
    title: "Obtén precios en menos de un minuto",
    text: "Comparamos automáticamente entre más de 10 compañías y te mostramos las mejores opciones.",
    reverse: true,
  },
  {
    icon: "✅",
    statNum: "0€",
    statLabel: "coste",
    number: "03",
    title: "Elige el plan que se ajuste a tus necesidades",
    text: "Sin compromiso ni letra pequeña: tú decides si cambias de compañía.",
    reverse: false,
  },
];

export function Steps() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <section className="relative bg-cream px-6 py-[120px]" id="como-funciona">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-[70px] md:gap-[110px]">
        {STEPS.map((step) => (
          <motion.div
            key={step.number}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 50 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className={`flex flex-col items-center gap-8 md:flex-row md:gap-[70px] ${step.reverse ? "md:flex-row-reverse" : ""}`}
          >
            <motion.div
              initial={prefersReducedMotion ? false : { scale: 1.05 }}
              whileInView={prefersReducedMotion ? undefined : { scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7, ease: SPRING }}
              className="relative flex aspect-square w-full max-w-[340px] flex-shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-navy md:w-[min(360px,42vw)]"
            >
              <div
                className="absolute inset-0"
                style={{ background: "radial-gradient(circle, #004568 0%, rgba(0,69,104,0) 70%)" }}
              />
              <span className="relative text-[clamp(80px,10vw,130px)]">{step.icon}</span>
              <div className="absolute bottom-5 right-5 rounded-2xl bg-cream px-4 py-2.5 text-right text-navy">
                <span className="block font-sans text-xl font-extrabold">{step.statNum}</span>
                <span className="block font-sans text-[10px] font-semibold uppercase tracking-[0.5px] text-navy/60">{step.statLabel}</span>
              </div>
            </motion.div>
            <div className="flex-1">
              <div className="font-sans text-[15px] font-extrabold tracking-wider text-orange">{step.number}</div>
              <div className="my-3.5 h-0.5 w-8 bg-orange" />
              <h3 className="mb-4 font-sans text-[clamp(24px,2.6vw,32px)] font-bold leading-tight text-navy">{step.title}</h3>
              <p className="max-w-[400px] font-sans text-[15px] leading-[1.7] text-navy/70">{step.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
