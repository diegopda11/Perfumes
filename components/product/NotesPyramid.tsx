import { formatList } from "@/lib/format";
import type { Product } from "@/types/product";

const tiers = [
  { key: "top", label: "Salida", hint: "Los primeros minutos" },
  { key: "heart", label: "Corazón", hint: "Cuando se asienta" },
  { key: "base", label: "Fondo", hint: "Lo que queda en la piel" },
] as const;

/** Notas de salida, corazón y fondo (CA-3.1). */
export function NotesPyramid({ notes }: { notes: Product["notes"] }) {
  return (
    <dl className="divide-y divide-glass-edge border-y border-glass-edge">
      {tiers.map((tier) => (
        <div key={tier.key} className="grid gap-1 py-5 sm:grid-cols-[160px_1fr] sm:gap-6">
          <dt>
            <span className="block text-lg">{tier.label}</span>
            <span className="block text-sm text-text-muted">{tier.hint}</span>
          </dt>
          <dd className="font-display text-xl leading-snug text-text/90 sm:text-[22px]">
            {formatList(notes[tier.key])}
          </dd>
        </div>
      ))}
    </dl>
  );
}
