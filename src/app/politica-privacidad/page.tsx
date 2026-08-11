/**
 * DRAFT — not legal advice, not reviewed by a lawyer. Before this page goes
 * live with real leads: (1) fill in every [PLACEHOLDER] with the real legal
 * entity's data, (2) have it reviewed by counsel qualified in Spanish/EU data
 * protection law. Content below accurately describes what this codebase's
 * /api/leads and /api/comparar routes actually do as of this writing — keep
 * it in sync if that logic changes (see src/app/api/leads and
 * src/app/api/comparar).
 */
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Política de Privacidad — Tarífalo",
};

export default function PoliticaPrivacidadPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-cream px-6 pb-24 pt-32 text-navy md:px-[60px]">
        <div className="mx-auto max-w-[760px]">
          <h1 className="font-sans text-[clamp(28px,4vw,40px)] font-extrabold text-navy">Política de Privacidad</h1>
          <p className="mt-3 font-sans text-sm text-navy/60">Última actualización: [FECHA]</p>

          <div className="mt-10 flex flex-col gap-8 font-sans text-[15px] leading-[1.75] text-navy/80">
            <section>
              <h2 className="mb-2 text-lg font-bold text-navy">1. Responsable del tratamiento</h2>
              <p>
                <strong>[NOMBRE LEGAL DE LA EMPRESA]</strong>, con NIF <strong>[NIF]</strong> y domicilio en{" "}
                <strong>[DIRECCIÓN FISCAL]</strong>, es el responsable del tratamiento de los datos personales que
                recabamos a través de este sitio web. Puedes contactarnos para cualquier cuestión relativa a
                privacidad en <strong>[EMAIL DE CONTACTO DE PRIVACIDAD]</strong>.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-bold text-navy">2. Qué datos recopilamos</h2>
              <p className="mb-3">Recopilamos datos personales únicamente cuando rellenas alguno de estos formularios:</p>
              <ul className="ml-5 list-disc space-y-2">
                <li>
                  <strong>Aviso de bajada de precio (pie de página):</strong> tu dirección de correo electrónico.
                </li>
                <li>
                  <strong>Formulario de comparación (/comparar):</strong> nombre, correo electrónico, teléfono
                  (opcional), tipo de tarifa que te interesa, código postal (opcional) y una estimación de tu
                  factura mensual (opcional).
                </li>
              </ul>
              <p className="mt-3">No recopilamos datos de navegación mediante cookies de analítica o publicidad — ver sección 6.</p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-bold text-navy">3. Con qué finalidad tratamos tus datos</h2>
              <ul className="ml-5 list-disc space-y-2">
                <li>Enviarte por email avisos cuando bajen los precios de las tarifas, si te has suscrito.</li>
                <li>
                  Contactarte para ofrecerte una comparación de tarifas personalizada y verificada, si has usado el
                  formulario de comparación. El resultado que ves al enviar ese formulario es un{" "}
                  <strong>ejemplo ilustrativo</strong> con tarifas de muestra, no una oferta real — lo usamos para
                  guiar el contacto posterior, no como resultado final.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-bold text-navy">4. Base legal</h2>
              <p>
                El tratamiento se basa en tu <strong>consentimiento explícito</strong> (art. 6.1.a del RGPD), que
                prestas al marcar la casilla correspondiente o al enviar el formulario. Puedes retirar tu
                consentimiento en cualquier momento sin que ello afecte a la licitud del tratamiento previo.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-bold text-navy">5. Cuánto tiempo conservamos tus datos</h2>
              <p>
                Conservamos tus datos mientras mantengas tu suscripción o hasta que te contactemos con la
                comparación solicitada, y en todo caso hasta que ejerzas tu derecho de supresión. [PLAZO CONCRETO A
                DEFINIR, p.ej. &ldquo;o durante un máximo de X meses desde el último contacto&rdquo;].
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-bold text-navy">6. Con quién compartimos tus datos</h2>
              <p className="mb-3">
                No vendemos ni cedemos tus datos a terceros con fines comerciales propios de esos terceros. Usamos
                los siguientes encargados del tratamiento para operar el sitio:
              </p>
              <ul className="ml-5 list-disc space-y-2">
                <li>
                  <strong>Vercel Inc.</strong> — alojamiento y ejecución de la aplicación web.
                </li>
                <li>
                  <strong>Neon Inc.</strong> — base de datos donde se almacenan los formularios recibidos, alojada
                  en infraestructura de AWS en Estados Unidos. Esta transferencia internacional de datos se realiza
                  amparada en las garantías correspondientes (cláusulas contractuales tipo de la Comisión Europea u
                  otro mecanismo equivalente que el responsable deberá verificar y documentar antes de publicar esta
                  política).
                </li>
              </ul>
              <p className="mt-3">No utilizamos estos datos para entrenar modelos de inteligencia artificial.</p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-bold text-navy">7. Tus derechos</h2>
              <p className="mb-3">
                Puedes ejercer en cualquier momento tus derechos de acceso, rectificación, supresión, limitación,
                portabilidad y oposición escribiendo a <strong>[EMAIL DE CONTACTO DE PRIVACIDAD]</strong>, indicando
                el derecho que deseas ejercer y adjuntando una copia de tu documento de identidad.
              </p>
              <p>
                Si consideras que el tratamiento de tus datos no se ajusta a la normativa vigente, tienes derecho a
                presentar una reclamación ante la{" "}
                <strong>Agencia Española de Protección de Datos (AEPD)</strong>, a través de{" "}
                <a href="https://www.aepd.es" className="underline" target="_blank" rel="noopener noreferrer">
                  www.aepd.es
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-bold text-navy">8. Cookies</h2>
              <p>
                Este sitio no utiliza cookies de analítica, publicidad ni seguimiento de terceros. Solo se usan las
                cookies técnicas estrictamente necesarias para el funcionamiento del alojamiento (Vercel), exentas
                del deber de consentimiento conforme al artículo 22.2 de la LSSI.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-bold text-navy">9. Cambios en esta política</h2>
              <p>
                Podemos actualizar esta política para reflejar cambios legales o en cómo tratamos tus datos.
                Publicaremos cualquier cambio relevante en esta misma página con su fecha de actualización.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
