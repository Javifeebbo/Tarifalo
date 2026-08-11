"use client";

import { motion, useReducedMotion } from "framer-motion";
import { IllustrativeBadge } from "./IllustrativeBadge";

/**
 * Fictional company names — none correspond to a real energy provider.
 * Tarífalo has no confirmed real partner relationships yet (see
 * PRODUCT.md's "Evidence on Hand" section), so this section stays
 * explicitly illustrative rather than naming real, unaffiliated brands.
 */
const PARTNERS = ["Voltia", "Luznova", "Kilovía", "Energética Norte", "Brisalux", "Solvento", "Gasfor", "Amperia"];

export function PartnerMarquee() {
  const prefersReducedMotion = useReducedMotion();
  const track = [...PARTNERS, ...PARTNERS];

  return (
    <section className="relative bg-grey-alt py-20">
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mb-9 flex items-center justify-center gap-2.5"
      >
        <span className="text-center font-sans text-[11px] font-semibold uppercase tracking-[2px] text-navy/50">
          Compañías de ejemplo
        </span>
        <IllustrativeBadge label="Ejemplo" />
      </motion.div>
      <div
        className="overflow-hidden"
        style={{ maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)" }}
      >
        <div
          className={`flex w-max items-center gap-16 ${prefersReducedMotion ? "" : "animate-marquee"}`}
        >
          {track.map((name, i) => (
            <span key={`${name}-${i}`} className="whitespace-nowrap font-sans text-xl font-bold text-navy/50" aria-hidden={i >= PARTNERS.length}>
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
