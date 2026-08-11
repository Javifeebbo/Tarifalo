import { Suspense } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ComparadorForm } from "@/components/ComparadorForm";

export default function ComparadorPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-cream px-6 pb-24 pt-32 md:px-[60px]">
        <div className="mx-auto mb-10 max-w-[560px] text-center">
          <h1 className="font-sans text-[clamp(30px,4vw,44px)] font-extrabold text-navy">Compara tu tarifa</h1>
          <p className="mt-3 font-sans text-[15px] text-navy/65">
            Cuéntanos lo básico y te mostramos un ejemplo de cómo sería tu comparación.
          </p>
        </div>
        <Suspense fallback={null}>
          <ComparadorForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
