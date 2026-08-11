---
name: Tarífalo Landing
description: Campaign landing page for Tarífalo, a Spanish energy tariff comparator — flat, utilitarian, no fine print.
colors:
  navy: "#003049"
  card-navy: "#004568"
  signal-orange: "#F77F00"
  ledger-cream: "#FCEFD8"
  ledger-cream-dim: "#FCEDD4"
  grey-alt: "#EEEEEE"
  white: "#FFFFFF"
typography:
  display:
    fontFamily: "Poppins, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "normal"
  headline:
    fontFamily: "Poppins, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.15
  body:
    fontFamily: "Poppins, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Poppins, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.08em"
rounded:
  sm: "8px"
  md: "16px"
  lg: "24px"
  full: "999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "48px"
  xl: "96px"
components:
  button-primary:
    backgroundColor: "{colors.signal-orange}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    padding: "14px 40px"
  button-primary-hover:
    backgroundColor: "{colors.signal-orange}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    padding: "14px 40px"
  ledger-row:
    backgroundColor: "{colors.card-navy}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "24px"
  ledger-entry-row:
    backgroundColor: "{colors.signal-orange}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "24px"
  illustrative-badge:
    backgroundColor: "{colors.ledger-cream}"
    textColor: "{colors.navy}"
    rounded: "{rounded.full}"
    padding: "6px 14px"
---

# Design System: Tarífalo Landing

## Overview

**Creative North Star: "The Open Ledger"**

The whole page reads as one continuous, honest ledger: a single vertical column of rows, each one a tariff type, each one showing its number in the open. Nothing is hidden behind a click, a form gate, or a "ver más." The ledger metaphor is not decorative — it is the literal expression of "sin letra pequeña": if the product's promise is no fine print, the page itself must have nothing folded away.

The system is flat by commitment, not by omission. Navy, orange, and cream are used as solid fields at page scale, never as gradients, never behind blur. The one piece of informality in an otherwise corporate palette is the icon language: real platform emoji (⚡🔥⭐☀️), never custom vector icons. This is a confirmed, deliberate brand trait carried from the live site, not a placeholder waiting to be replaced with "proper" icons.

This is a Persuade surface built to be left, not lived in: a visitor arrives, reads the ledger, understands the offer, acts, and goes. Nothing on the page should reward lingering the way a portfolio or an editorial piece would.

**Key Characteristics:**
- One continuous ledger column, not a stack of unrelated marketing sections
- Flat color fields at page scale; zero gradients, zero blur, zero glassmorphism
- Real emoji as the icon system, never custom icon sets
- Any figure that isn't the one confirmed real stat is visibly labeled as an illustrative example — never presented as live or fabricated as evidence

## Colors

Three solid fields carry the whole page; there is no secondary or tertiary accent beyond orange.

### Primary
- **Tarífalo Navy** (`#003049`): the base ground — hero/ledger background, footer, nav.
- **Signal Orange** (`#F77F00`): the only accent. CTAs, the ledger's active/entry row, illustrative-data badge borders. Rationed — if more than one thing on a viewport is orange, something else should not be.

### Secondary
- **Card Navy** (`#004568`): one step lighter than the primary ground. Used for ledger rows sitting on the navy background, so rows read as distinct without needing a shadow or border.

### Neutral
- **Ledger Cream** (`#FCEFD8`): light-section background and the illustrative-data badge fill. Also doubles as text-on-navy — this dual role (background in light sections, text color on dark ones) is a real, confirmed trait from the live site, not an inconsistency.
- **Ledger Cream Dim** (`#FCEDD4`): secondary/muted text on navy where full-opacity cream would compete with white body copy.
- **Grey Alt** (`#EEEEEE`): the one non-brand neutral, for light sections that need to sit apart from cream (kept from the earlier prototype's rhythm).
- **White** (`#FFFFFF`): primary text on navy; primary heading color on both grounds where cream would be too soft.

### Named Rules
**The One-Ground Rule.** Every section is a flat navy, card-navy, cream, or grey-alt field — never two colors blended, never a gradient between them.

## Typography

**Display & Body Font:** Poppins (with sans-serif fallback) — the only typeface in the system, at four weights (400/500/600/800).

**Character:** Confident and plain. Poppins ExtraBold (800) carries the big numbers and headlines; nothing italic, nothing condensed, nothing decorative — the type should never ask to be looked at for its own sake.

### Hierarchy
- **Display** (800, `clamp(2.5rem, 6vw, 4.5rem)`, 1.05): the one number or headline each viewport leads with.
- **Headline** (700, `clamp(1.5rem, 3vw, 2.25rem)`): section and ledger-row headings.
- **Body** (400, 16px, 1.6): supporting copy, always short.
- **Label** (600, 11px, 0.08em tracking, uppercase): row categories, the illustrative-data badge, micro-copy above a headline.

### Named Rules
**The No-Italic Rule.** Nothing in this system is italicized. Emphasis comes from weight (800 vs 400) and color (orange vs white/navy), never from slant.

## Layout

Single vertical column, capped at a comfortable reading width (max ~1100–1300px) and centered. No sidebar, no multi-column marketing grid. The ledger's entry row sits at the top of the column; tariff rows stack beneath it with consistent gaps (`spacing.sm`, 16px, between rows). Section padding uses the wide end of the scale (`spacing.xl`, 96px top/bottom) so the page breathes between the nav, the ledger, and the footer — density lives inside the ledger rows, not between sections.

Mobile: the same single column, rows stack full-width, the entry row stays pinned near the top rather than scrolling away, row internals (label, figure, CTA) stack vertically inside the row instead of trying to fit a horizontal layout at 375px.

## Elevation & Depth

Flat by commitment. No box-shadows anywhere in this system — depth is conveyed only through flat color layering (navy ground → card-navy row → cream badge), never through elevation, blur, or glass.

### Named Rules
**The Flat Ledger Rule.** If a component needs a shadow to read as distinct from its background, it is the wrong background pairing, not a missing shadow. Use `card-navy` on `navy`, or `ledger-cream` on `grey-alt`, instead.

## Shapes

Rounded rectangles throughout (`rounded.md`, 16px) for rows and content blocks; fully rounded pills (`rounded.full`) for every button, CTA, and badge. No sharp corners, no clipped/angled shapes, no circles except the emoji-chip treatment inherited from the confirmed icon language. Row separation reads as a thin rule or gap, never a card border — this system does not use borders as a default separator.

## Components

### Buttons
- **Shape:** fully rounded pill (`rounded.full`).
- **Primary:** `signal-orange` background, white text, `padding: 14px 40px`, Poppins 600.
- **Hover:** lift (`translateY(-3px)`) plus a slight brightness increase — no color change, no shadow introduced.
- **Ghost/nav variant:** transparent background, cream text, same pill shape, used only for the single nav CTA slot when a secondary action is needed.

### Ledger Row
- **Shape:** `rounded.md` (16px), full-width within the column.
- **Background:** `card-navy` on the navy ground.
- **Content:** category emoji + label on one side, the figure (labeled illustrative) and CTA on the other.
- **Divider:** rows separate by a `spacing.xs` (8px) gap, not a border or shadow.

### Ledger Entry Row
- **Shape:** same `rounded.md` as other rows, but visually the ledger's lead row.
- **Background:** `signal-orange` — the one row that owns the accent color, marking it as the interactive/lead position without implying it is a live input.
- **Content:** the prompt ("¿cuánto pagas ahora?") plus the illustrative-data badge, always visible in this row — this is the row most at risk of reading as a live calculator, so it carries the badge every time, not just on first render.

### Illustrative-Data Badge (signature component)
- **Style:** `ledger-cream` pill, `navy` text, Poppins 600 label case ("EJEMPLO ILUSTRATIVO" / "EJEMPLO"), `padding: 6px 14px`.
- **Placement:** attached to every figure in the ledger that is not the one confirmed-real stat (450€ ahorro medio / 1 min / 10+ compañías). Never omitted for convenience, never styled to look like a live status chip (no pulsing dot, no "calculando…" motion).
- **Rule:** if a number on this page came from anywhere other than the confirmed PRODUCT.md evidence, it wears this badge. No exceptions.

### Navigation
- **Style:** wordmark ("tarífalo," lowercase, Poppins 700, cream) top-left, single CTA pill top-right. No link list — this is a campaign landing page, not the site's primary nav (see PRODUCT.md's scope decision).
- **States:** transparent over the hero at rest; on scroll, background steps to translucent navy (no blur-heavy glass treatment — a flat translucent fill, not a frosted one).
- **Mobile:** same two elements, no hamburger menu needed since there is nothing to collapse.

## Do's and Don'ts

### Do:
- **Do** keep every section a single flat color field (navy, card-navy, cream, or grey-alt).
- **Do** label every non-confirmed figure with the illustrative-data badge, every time it appears.
- **Do** use real platform emoji for all category icons — never swap in a custom icon set.
- **Do** use orange as a rationed accent — CTAs, the entry row, badge borders — never as a background field on its own beyond those.

### Don't:
- **Don't** use any gradient, anywhere, including gradient text.
- **Don't** use glassmorphism, backdrop blur, or floating translucent cards.
- **Don't** use italic type, serif display faces, or scroll-scrubbed cinematic video heroes.
- **Don't** use fake urgency countdowns, trust-badge walls, or stock lifestyle photography of families at the fridge.
- **Don't** gate the first result behind a multi-step form — the ledger shows every row's category up front.
- **Don't** invent testimonials, partner logos, or per-tariff savings figures. Every unconfirmed number is a labeled example, not a fabricated fact.
