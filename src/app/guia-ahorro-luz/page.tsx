import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { LeadMagnetForm } from "@/components/LeadMagnetForm";

export const metadata: Metadata = {
  title: "Guía gratis: 7 trucos para ahorrar en tu factura de la luz — Tarífalo",
  description:
    "Descárgate gratis la guía de Tarífalo con 7 trucos para ahorrar en tu factura de la luz. Solo necesitamos tu nombre, teléfono y email.",
};

export default function GuiaAhorroLuzPage() {
  return (
    <>
      <Nav />
      <main>
        <LeadMagnetForm />
      </main>
      <Footer />
    </>
  );
}
