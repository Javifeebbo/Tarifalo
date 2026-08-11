# Tarífalo Landing

Landing de campaña para Tarífalo (comparador de tarifas de luz/gas), Next.js 14
(App Router) + Tailwind CSS + Framer Motion, con captura de leads real sobre
Neon Postgres.

Ver `PRODUCT.md` para contexto de producto y `DESIGN.md` para el sistema de diseño
(reglas vinculantes: sin gradientes, sin sombras, colores planos — "The Open Ledger").

## Rutas

| Ruta | Descripción |
|---|---|
| `/` | Home — hero con slider, mockup del comparador, servicios, footer con opt-in |
| `/comparar` | Formulario de comparación (nombre, email, teléfono, tarifa, CP, factura) |
| `/guia-ahorro-luz` | **Nuevo.** Lead magnet — descarga gratis de la guía en PDF a cambio de nombre, teléfono y email |
| `/politica-privacidad` | Borrador de política de privacidad — **rellenar antes de producción real**, ver el aviso al principio del archivo |

## Leads

Todos los formularios escriben en la misma tabla `leads` (Postgres), diferenciados
por la columna `source`:

- `newsletter` — opt-in del footer (solo email)
- `comparador` — formulario de `/comparar` (nombre, email, teléfono opcional, tarifa, CP, factura)
- `lead_magnet` — formulario de `/guia-ahorro-luz` (nombre, teléfono, email), con la
  columna `campaign` = `'guia-ahorro-luz'` para poder distinguir futuros lead magnets
  sin necesitar otra tabla

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # y rellena DATABASE_URL con tu conexión de Neon
node scripts/migrate.mjs     # aplica/actualiza el esquema (scripts/schema.sql)
npm run dev
```

## Desplegar en Vercel

1. Sube este repo a GitHub (privado o público, como prefieras).
2. En Vercel: **Add New → Project** → importa el repo.
3. En **Environment Variables**, añade `DATABASE_URL` (si usas la integración de
   Neon desde el Marketplace de Vercel, esto se rellena solo).
4. Deploy.

Si ya tienes el proyecto en Vercel sin repo conectado (deploy hecho por CLI), puedes
conectarlo después desde **Project → Settings → Git → Connect Git Repository** sin
perder las variables de entorno ni el dominio.

## Notas

- Faltan dos assets binarios que no se pudieron recuperar en esta sesión:
  `public/about-photo.png` (usado en `About.tsx`) y `src/app/favicon.ico`.
  Cópialos desde el deployment de Vercel (**Deployment → Source**) o desde tu
  copia local si la tienes, antes de desplegar.
- La política de privacidad (`/politica-privacidad`) es un borrador con
  `[PLACEHOLDER]` sin rellenar — no recojas leads reales en producción hasta
  completarla y que la revise alguien con conocimiento de RGPD/LSSI.
