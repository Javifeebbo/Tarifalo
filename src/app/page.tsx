/**
 * THESIS: Full campaign landing ported from the retired vanilla-HTML
 * prototype's hero+slider design (see repo root's former index.html),
 * consolidated into this Next.js project as the single source of truth.
 * Fabricated evidence from that prototype (customer testimonials) was
 * intentionally dropped per PRODUCT.md's confirmed no-fabrication rule.
 * The partner-logo marquee was restored on request but with fictional
 * company names (never real, unaffiliated brands) — see
 * PartnerMarquee.tsx. Per-tariff savings figures are labeled as
 * illustrative examples rather than presented as verified data.
 */
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Mockup } from "@/components/Mockup";
import { Manifesto } from "@/components/Manifesto";
import { About } from "@/components/About";
import { Steps } from "@/components/Steps";
import { Servicios } from "@/components/Servicios";
import { PartnerMarquee } from "@/components/PartnerMarquee";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Mockup />
        <Manifesto />
        <About />
        <Steps />
        <Servicios />
        <PartnerMarquee />
      </main>
      <Footer />
    </>
  );
}
