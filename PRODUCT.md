# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Household consumers in Spain who want to lower their electricity and/or gas bill. They are comparing tariffs across providers (luz, gas, luz+gas, and solar self-consumption) and are put off by comparators that demand account creation, uploaded bills, or lengthy forms before showing a result.

## Product Purpose

Tarífalo is a free tariff comparator: enter basic consumption details and get back the best available luz/gas/luz+gas/solar offers across 10+ energy companies in under a minute, with no documents or bills required. This project is the marketing landing page for that product — it sells the comparison, it does not implement the comparison engine itself.

## Positioning

The differentiator is friction removal, not price alone: no account, no uploaded bills, no fine print ("sin letra pequeña"), result in under a minute. A neighboring comparator that still requires document upload or account sign-up before showing a price could not truthfully make the same claim.

## Operating Context

The landing page is the entry point into a separate comparison flow (form → results). As of the backend work below, this project now implements that flow's *lead capture* end (`/comparar` form → stored lead → illustrative example results), but not a real comparison engine — no live pricing data from actual energy companies is connected. The page must set correct expectations for that flow (quick, document-free) without overstating what's implemented.

**Scope decision (confirmed):** this is a parallel/campaign landing page, not a replacement for tarifalo.com's real homepage. It does not need to carry the full site IA (Comparador catalog, Tarifas listing, Empresas B2B section, Blog) — those remain the real site's job. Minimal nav (wordmark + single CTA) is therefore correct for this surface and should not be read as a general site-nav pattern. If this project is ever repurposed to replace the real homepage, the nav decision must be revisited then, not assumed to carry over.

## Capabilities and Constraints

- Confirmed: this repository builds the marketing landing page, on Next.js 14 (App Router) + Tailwind CSS + Framer Motion, now with a real lead-capture backend (Next.js API routes + Neon Postgres via the Vercel Marketplace integration). It does **not** include a real comparator/results engine — no live pricing data from actual energy companies is connected or planned yet.
- Confirmed brand facts (extracted from the live tarifalo.com site): wordmark "tarífalo," lowercase, no icon mark. Colors: navy `#003049` (primary), card navy `#004568`, orange `#F77F00` (accent/CTA), cream `#FCEFD8` / `#FCEDD4`. Typeface: Poppins. Icon language: literal platform emoji (⚡🔥⭐☀️💯⏰🙊❤️‍🔥🏆), an informal touch against an otherwise corporate navy/cream palette.
- Confirmed: `/api/leads` (newsletter opt-in) and `/api/comparar` (comparator form) both validate input server-side and insert into a `leads` table (Postgres, schema in `scripts/schema.sql`). `/api/comparar` returns results computed from an `example_tariffs` seed table — every row there is fabricated example data, matching the same no-fabrication rule as testimonials/logos above, and the API response carries `illustrative: true` plus a disclaimer string that the UI must always render, never hide, alongside the numbers.
- Confirmed (added): `/guia-ahorro-luz` is a lead-magnet page (`LeadMagnetForm.tsx`) offering a free PDF ("7 trucos para ahorrar en tu factura de la luz") in exchange for name, phone and email. It posts to `/api/lead-magnet`, which validates server-side (name ≥3 chars, Spanish phone format, email format, explicit consent) and inserts into the same `leads` table used by `/api/leads` and `/api/comparar` — `source = 'lead_magnet'`, tagged via the new nullable `campaign` column (`'guia-ahorro-luz'`) rather than a parallel table, so all lead sources stay queryable from one place. The PDF itself lives at `public/tarifalo-guia-ahorro-luz.pdf` and downloads automatically client-side on a successful submit. Visually this page reuses the confirmed flat/no-gradient/no-shadow system below (`DESIGN.md`) rather than the gradient/shadow treatment explored earlier in a Figma concept for the same flow — the Figma version was direction-setting for copy and layout, not for finish, since it predates this project's binding design system.
- Gap, not yet resolved: there is no privacy policy page, and the `/comparar` form's consent checkbox links to nothing — real leads should not be collected in production until a real privacy policy exists (Spanish market, RGPD applies to storing name/email/phone). This gap also applies to `/guia-ahorro-luz`, which links to the same placeholder policy page.
- Undecided: how/when real tariff pricing data gets connected (data source, partnership, or manual/verified entry — see the "Evidence on Hand" discussion this decision was raised in); final page structure and visual world are decided in `shape`/`new-work`, not here.

## Brand Commitments

Name: Tarífalo (lowercase wordmark only, no symbol). Palette and typography above are binding, carried over from the live site. Icon treatment (real emoji, not custom vector icons) is a deliberate, confirmed brand choice — do not replace it with generic flat icons.

Voice: confident and direct, savings-led, never hype-driven or "startup-bro." No fine print in the literal sense (all claims on the page must be true and unhedged) and none in tone either — say what the product does plainly, don't oversell it.

## Evidence on Hand

No real testimonials, case studies, customer logos, or partner relationships exist yet. An earlier throwaway prototype (a single-file HTML build, not this project) fabricated placeholder testimonials and a partner-logo marquee (Endesa, Naturgy, etc.) purely for visual demonstration — those are not real and must not be reused as evidence or reproduced as if genuine. This landing page should omit social proof, or structure a section to receive real proof later, rather than inventing quotes, names, numbers, or logos.

**Same rule extended to monetary figures (confirmed):** no confirmed real numbers exist for per-tariff savings (e.g. a "Luz: ahorra 270€/año" breakdown was authored for the earlier prototype's demo copy, not verified against a real data source). The aggregate "450€ ahorro medio / 1 min / 10+ compañías" line from the live site's About copy is the only monetary/stat claim treated as real; everything else — any ledger entry row, any per-tariff estimate, any live-looking calculation — is illustrative example data and must be visibly labeled as such (e.g. "ejemplo ilustrativo," not styled or worded as a live input/output). This is the same no-fabrication rule as testimonials and logos, applied to money, where the cost of getting it wrong is higher, not lower.

## Product Principles

1. Speed and simplicity over completeness — every screen should feel like it takes less time than the last time the visitor compared tariffs elsewhere.
2. No fine print, no hidden friction — copy claims must be literally true; don't imply speed or simplicity the product doesn't deliver.
3. Confident, direct voice — lead with the saving, never pad with hype or generic SaaS language.
4. Preserve the confirmed brand system exactly — navy/orange/cream, Poppins, lowercase wordmark, emoji icon language — new visual decisions extend it, they don't replace it.
5. Never fabricate evidence — degrade gracefully (omit or defer) rather than inventing testimonials, logos, or numbers.

## Anti-References

Explicit, binding constraints on what this landing page must not become:

- **Not a glassmorphism SaaS dashboard.** No gradient text, no purple/violet gradients, no decorative logo marquee, no floating blurred cards. Tarífalo is flat and gradient-free — this is already how the confirmed brand tokens work, not a new restriction.
- **Not luxury cinematic editorial.** No italic serif, no scroll-scrubbed video hero, no aspirational brand-experience tone. Tarífalo is utilitarian: the visitor arrives, compares, leaves — this is not a brand experience to linger in.
- **Not a generic Spanish tariff-comparator page.** No fake urgency countdowns, no wall of trust badges/seals, no stock photo of a smiling family by the fridge, no 8-step form gating the first result. Tarífalo's actual differentiation is the opposite of these patterns: no documents, one minute, no fine print — the page should read that way, not perform trustworthiness through clichés.
- **Not a repeat of the earlier vanilla prototype's evidence problem.** Zero invented testimonials, zero partner logos without a real relationship. If a layout needs social proof to avoid feeling empty, mark that placeholder explicitly as pending real content — never fabricated filler.

## Accessibility & Inclusion

No product-specific accessibility requirement established yet.
