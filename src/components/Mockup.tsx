"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SPRING } from "@/lib/animations";
import { IllustrativeBadge } from "./IllustrativeBadge";

const TABS = [
  { label: "Luz", icon: "⚡" },
  { label: "Gas", icon: "🔥" },
  { label: "Luz + Gas", icon: "⭐" },
  { label: "Solar", icon: "☀️" },
];
/**
 * 450€ / 10+ / 1 min are the one confirmed-real aggregate stat (PRODUCT.md).
 * "+12%" and "30+" are not verified against any real data source, so they
 * carry the illustrative badge — same rule, same exceptions-free policy,
 * as the Servicios tariff cards.
 */
const STATS = [
  { icon: "💰", num: "450€", delta: "+12%", deltaIllustrative: true, label: "Ahorro medio" },
  { icon: "📊", num: "30+", label: "Tarifas comparadas", illustrative: true },
  { icon: "🏢", num: "10+", label: "Compañías" },
  { icon: "⏱️", num: "1 min", label: "Tiempo" },
];

export function Mockup() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <section className="relative bg-navy px-6 pb-[130px] pt-[100px]" id="mockup">
      <motion.div
        className="mx-auto max-w-[980px]"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 28, scale: 0.96 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: SPRING }}
      >
        <div className="flex items-center gap-4 rounded-t-[14px] bg-[#012537] px-5 py-3.5">
          <div className="flex flex-shrink-0 gap-[7px]">
            <span className="block h-[11px] w-[11px] rounded-full bg-[#ff5f57]" />
            <span className="block h-[11px] w-[11px] rounded-full bg-[#febc2e]" />
            <span className="block h-[11px] w-[11px] rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 truncate rounded-lg bg-white/[0.06] px-3.5 py-1.5 text-xs text-cream/50">
            app.tarifalo.com/comparador
          </div>
        </div>
        <div className="rounded-b-[20px] bg-cream p-9 shadow-[0_40px_80px_rgba(0,0,0,0.35)]">
          <div className="mb-8 flex flex-wrap gap-2">
            {TABS.map((tab, i) => (
              <div
                key={tab.label}
                className={
                  i === 0
                    ? "flex items-center gap-1.5 rounded-full bg-orange px-5 py-2.5 text-[13px] font-semibold text-navy"
                    : "flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[13px] font-semibold text-navy/55"
                }
              >
                <span aria-hidden="true">{tab.icon}</span>
                {tab.label}
              </div>
            ))}
          </div>
          <div className="mb-8 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-4">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="flex items-center gap-2">
                  <span className="text-lg leading-none" aria-hidden="true">
                    {stat.icon}
                  </span>
                  <span className="font-sans text-[28px] font-extrabold text-navy md:text-[30px]">{stat.num}</span>
                  {stat.delta && (
                    <span className="rounded-full bg-[rgba(30,158,82,0.15)] px-2 py-0.5 text-[11px] font-bold text-[#1e9e52]">
                      {stat.delta}
                    </span>
                  )}
                </div>
                <div className="mt-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.5px] text-navy/55">{stat.label}</div>
                {(stat.deltaIllustrative || stat.illustrative) && (
                  <div className="mt-1.5">
                    <IllustrativeBadge label="Ejemplo" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div>
            <svg viewBox="0 0 600 200" preserveAspectRatio="none" className="block h-auto w-full">
              <defs>
                <linearGradient id="gradBefore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F77F00" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#F77F00" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradAfter" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#004568" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#004568" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <path
                d="M0,60 C100,50 180,90 260,70 C340,50 420,80 600,40 L600,200 L0,200 Z"
                fill="url(#gradBefore)"
                stroke="#F77F00"
                strokeWidth={2}
              />
              <path
                d="M0,140 C100,150 180,120 260,135 C340,150 420,110 600,150 L600,200 L0,200 Z"
                fill="url(#gradAfter)"
                stroke="#004568"
                strokeWidth={2}
              />
            </svg>
            <div className="mt-3.5 flex flex-wrap gap-6">
              <span className="flex items-center gap-1.5 text-xs font-medium text-navy/65">
                <i className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "#F77F00" }} />
                Precio sin Tarífalo
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-navy/65">
                <i className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "#004568" }} />
                Precio con Tarífalo
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
