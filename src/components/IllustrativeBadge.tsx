type IllustrativeBadgeProps = {
  label?: string;
};

/**
 * Attached to every figure on the page that is not the one confirmed-real
 * stat (450€ ahorro medio / 1 min / 10+ compañías — see PRODUCT.md). Never
 * omitted for convenience, never styled to look like a live status chip.
 */
export function IllustrativeBadge({ label = "Ejemplo ilustrativo" }: IllustrativeBadgeProps) {
  return (
    <span className="inline-block rounded-full bg-cream px-3.5 py-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-navy">
      {label}
    </span>
  );
}
