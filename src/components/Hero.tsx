"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { SPRING, SNAP, GRAVITY } from "@/lib/animations";

type Benefit = { glyph: string; tilt: number };

type Slide = {
  micro: string;
  title: [string, string];
  icon: string;
  name: string;
  desc: string;
  tariffType: "luz" | "gas" | "luz_gas" | "solar";
  benefits: [Benefit, Benefit, Benefit];
};

const SLIDES: Slide[] = [
  {
    micro: "🔸 Ahorra hasta 270€ anuales",
    title: ["COMPARA", "LUZ"],
    icon: "⚡",
    name: "Compara Luz",
    desc: "Encuentra la tarifa eléctrica que mejor se adapta a tu consumo entre las compañías líderes del mercado.",
    tariffType: "luz",
    benefits: [
      { glyph: "💯", tilt: -8 },
      { glyph: "⏰", tilt: 6 },
      { glyph: "🙊", tilt: -5 },
    ],
  },
  {
    micro: "🔸 Ahorra hasta 180€ anuales",
    title: ["COMPARA", "GAS"],
    icon: "🔥",
    name: "Compara Gas",
    desc: "Compara tarifas de gas natural y descubre cuánto puedes ahorrar cada mes sin cambiar de compañía.",
    tariffType: "gas",
    benefits: [
      { glyph: "❤️‍🔥", tilt: 7 },
      { glyph: "🏆", tilt: -6 },
      { glyph: "😊", tilt: 5 },
    ],
  },
  {
    micro: "🔸 Ahorra hasta 450€ anuales",
    title: ["COMPARA", "LUZ + GAS"],
    icon: "⭐",
    name: "Compara Luz + Gas",
    desc: "Un solo formulario para comparar electricidad y gas juntos y quedarte con la oferta más completa.",
    tariffType: "luz_gas",
    benefits: [
      { glyph: "💯", tilt: -6 },
      { glyph: "⏰", tilt: 8 },
      { glyph: "❤️‍🔥", tilt: -4 },
    ],
  },
  {
    micro: "🔸 Genera tu propia energía",
    title: ["COMPARA", "SOLAR"],
    icon: "☀️",
    name: "Compara Solar",
    desc: "Descubre soluciones de autoconsumo solar y empieza a generar tu propia energía desde casa.",
    tariffType: "solar",
    benefits: [
      { glyph: "🏆", tilt: 5 },
      { glyph: "😊", tilt: -7 },
      { glyph: "🙊", tilt: 6 },
    ],
  },
];

type SlideRefs = {
  micro: HTMLDivElement | null;
  title: HTMLHeadingElement | null;
  content: HTMLDivElement | null;
  icon: HTMLDivElement | null;
  benefits: (HTMLDivElement | null)[];
};

export function Hero() {
  const [counter, setCounter] = useState(1);
  const current = useRef(0);
  const animating = useRef(false);
  const containerRefs = useRef<(HTMLDivElement | null)[]>(SLIDES.map(() => null));
  const slideRefs = useRef<SlideRefs[]>(SLIDES.map(() => ({ micro: null, title: null, content: null, icon: null, benefits: [null, null, null] })));

  const goTo = (next: number, direction: "next" | "prev") => {
    if (animating.current || next === current.current) return;
    animating.current = true;

    const dir = direction === "next" ? 1 : -1;
    const curr = slideRefs.current[current.current];
    const nxt = slideRefs.current[next];
    const currContainer = containerRefs.current[current.current];
    const nextContainer = containerRefs.current[next];

    if (currContainer) {
      currContainer.style.zIndex = "2";
      currContainer.setAttribute("aria-hidden", "true");
    }
    if (nextContainer) {
      nextContainer.style.zIndex = "1";
      nextContainer.style.opacity = "1";
      nextContainer.style.pointerEvents = "auto";
      nextContainer.removeAttribute("aria-hidden");
    }

    animate([nxt.micro, nxt.title, nxt.content], { opacity: 0, x: dir * 50 }, { duration: 0 });
    if (nxt.icon) animate(nxt.icon, { opacity: 0, x: dir * 140, rotate: dir * 35 }, { duration: 0 });
    nxt.benefits.forEach((el) => {
      if (el) animate(el, { opacity: 0, y: "-90vh" }, { duration: 0 });
    });

    requestAnimationFrame(() => {
      animate([curr.micro, curr.title, curr.content], { opacity: 0, x: -dir * 50 }, { duration: 0.5, ease: SNAP });
      if (curr.icon) animate(curr.icon, { opacity: 0, x: -dir * 140, rotate: -dir * 35 }, { duration: 0.5, ease: SNAP });
      curr.benefits.forEach((el) => {
        if (el) animate(el, { opacity: 0, y: "-110vh" }, { duration: 0.5, ease: SNAP });
      });

      animate(nxt.title, { opacity: 1, x: 0 }, { duration: 0.85, ease: SPRING });
      animate(nxt.micro, { opacity: 1, x: 0 }, { duration: 0.85, ease: SPRING, delay: 0.04 });
      animate(nxt.content, { opacity: 1, x: 0 }, { duration: 0.85, ease: SPRING, delay: 0.08 });
      if (nxt.icon) animate(nxt.icon, { opacity: 1, x: 0, rotate: 0 }, { duration: 0.85, ease: SPRING });
      const benefitDelays = [0.3, 0.38, 0.46];
      nxt.benefits.forEach((el, i) => {
        if (el) animate(el, { opacity: 1, y: 0, rotate: SLIDES[next].benefits[i].tilt }, { duration: 0.8, ease: GRAVITY, delay: benefitDelays[i] });
      });

      current.current = next;
      setCounter(next + 1);

      setTimeout(() => {
        if (currContainer) {
          currContainer.style.opacity = "0";
          currContainer.style.pointerEvents = "none";
        }
        animating.current = false;
      }, 850);
    });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo((current.current + 1) % SLIDES.length, "next");
      else if (e.key === "ArrowLeft") goTo((current.current - 1 + SLIDES.length) % SLIDES.length, "prev");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden bg-navy" id="inicio">
      <div className="relative h-full w-full">
        <div className="absolute left-6 top-[104px] z-[6] inline-flex items-center gap-2 rounded-full bg-cream py-2.5 pl-3 pr-4 font-sans text-xs font-semibold text-navy md:left-[60px]">
          <span className="relative h-2 w-2 flex-shrink-0">
            <span className="absolute inset-0 animate-ping-slow rounded-full bg-orange" />
            <span className="absolute inset-0 rounded-full bg-orange" />
          </span>
          🎉 ¡Estamos de aniversario! Sorteamos un viaje a Tailandia
        </div>
        {SLIDES.map((slide, i) => (
          <div
            key={slide.name}
            ref={(el) => {
              containerRefs.current[i] = el;
            }}
            className="absolute inset-0"
            style={{ opacity: i === 0 ? 1 : 0, pointerEvents: i === 0 ? "auto" : "none", zIndex: i === 0 ? 2 : 1 }}
            data-slide-index={i}
            aria-hidden={i !== 0}
          >
            <div
              ref={(el) => {
                slideRefs.current[i].micro = el;
              }}
              className="absolute left-6 top-[26%] font-sans text-[15px] font-semibold text-cream md:left-[60px]"
            >
              {slide.micro}
            </div>
            <h1
              ref={(el) => {
                slideRefs.current[i].title = el;
              }}
              className="absolute left-6 top-[33%] max-w-[70vw] font-sans text-[clamp(38px,6vw,90px)] font-extrabold leading-[1.02] text-white md:left-[60px] md:max-w-[56vw]"
            >
              {slide.title[0]}
              <br />
              {slide.title[1]}
            </h1>
            <div className="absolute right-[4vw] top-1/2 z-[3] h-[clamp(120px,34vw,480px)] w-[clamp(120px,34vw,480px)] -translate-y-1/2">
              <div
                ref={(el) => {
                  slideRefs.current[i].icon = el;
                }}
                className="relative flex h-full w-full items-center justify-center"
              >
                <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle, #004568 0%, rgba(0,69,104,0) 70%)" }} />
                <span className="relative text-[clamp(68px,24vw,340px)] leading-none" style={{ filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.45))" }}>
                  {slide.icon}
                </span>
              </div>
            </div>
            <div className="pointer-events-none absolute right-[4vw] top-1/2 z-[4] h-[clamp(120px,34vw,480px)] w-[clamp(120px,34vw,480px)] -translate-y-1/2">
              {slide.benefits.map((b, bi) => (
                <div
                  key={bi}
                  ref={(el) => {
                    slideRefs.current[i].benefits[bi] = el;
                  }}
                  className="absolute flex items-center justify-center rounded-full bg-cream shadow-[0_12px_24px_rgba(0,0,0,0.25)]"
                  style={benefitPosition(bi)}
                >
                  <span style={{ transform: "rotate(0deg)" }}>{b.glyph}</span>
                </div>
              ))}
            </div>
            <div
              ref={(el) => {
                slideRefs.current[i].content = el;
              }}
              className="absolute bottom-[130px] left-6 z-[5] max-w-[260px] md:bottom-[150px] md:left-[60px] md:max-w-[420px]"
            >
              <div className="mb-2.5 text-2xl font-semibold text-white">{slide.name}</div>
              <div className="mb-6 max-w-[420px] text-[15px] font-normal leading-relaxed text-white/75">{slide.desc}</div>
              <a
                href={`/comparar?tarifa=${slide.tariffType}`}
                className="inline-block rounded-full bg-orange px-10 py-3.5 text-[15px] font-semibold text-navy transition-transform duration-300 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
              >
                ¡Comparar y participar!
              </a>
            </div>
          </div>
        ))}

        <div className="absolute bottom-9 right-6 z-10 flex items-center gap-4 md:right-[58px]">
          <div
            className="font-sans text-[13px] tracking-wider text-white/60"
            style={{ fontVariantNumeric: "tabular-nums" }}
            aria-live="polite"
          >
            {String(counter).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
          </div>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => goTo((current.current - 1 + SLIDES.length) % SLIDES.length, "prev")}
            className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-white/30 text-cream transition-colors duration-300 hover:border-white/60 hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => goTo((current.current + 1) % SLIDES.length, "next")}
            className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-white/30 text-cream transition-colors duration-300 hover:border-white/60 hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <a
          href="#mockup"
          className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-center text-[11px] uppercase tracking-[2px] text-white/45"
        >
          Descubre
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none" className="mx-auto mt-1.5 animate-scroll-hint">
            <path d="M1 1L7 7L13 1" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  );
}

function benefitPosition(index: number): React.CSSProperties {
  if (index === 0) return { top: "10%", left: "8%", width: "clamp(48px,6.5vw,92px)", height: "clamp(48px,6.5vw,92px)", fontSize: "clamp(22px,3.2vw,44px)" };
  if (index === 1) return { top: "6%", right: "6%", width: "clamp(44px,5.8vw,82px)", height: "clamp(44px,5.8vw,82px)", fontSize: "clamp(20px,2.8vw,38px)" };
  return { bottom: "16%", right: "20%", width: "clamp(38px,5vw,72px)", height: "clamp(38px,5vw,72px)", fontSize: "clamp(16px,2.4vw,32px)" };
}
