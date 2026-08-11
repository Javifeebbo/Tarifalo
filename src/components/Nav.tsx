"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { enterFade } from "@/lib/animations";

/**
 * Minimal wordmark + single CTA. No link list — this is a campaign landing
 * page, not tarifalo.com's primary site nav (see PRODUCT.md's scope decision).
 *
 * Transparent-over-hero only makes sense on "/", which opens on the dark
 * navy hero. Every other route opens on a light (cream) background, so the
 * nav stays solid there from the start — otherwise the cream wordmark reads
 * invisible against a cream page until the user scrolls past 60px.
 */
export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(!isHome);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  return (
    <motion.nav
      initial={prefersReducedMotion ? undefined : "hidden"}
      animate="visible"
      variants={enterFade}
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 transition-colors duration-500 md:px-12"
      style={{ backgroundColor: scrolled ? "rgba(0,48,73,0.85)" : "rgba(0,48,73,0)" }}
    >
      <a href="/" className="font-sans text-xl font-bold lowercase text-cream">
        tarífalo
      </a>
      <a
        href="/comparar"
        className="rounded-full bg-orange px-6 py-3 font-sans text-sm font-semibold text-navy transition-transform duration-300 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
      >
        Comparar ahora
      </a>
    </motion.nav>
  );
}
