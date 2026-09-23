import { formatList } from "@/lib/format";
import type { Product } from "@/types/product";
import styles from "./NotesPyramid.module.css";

const tiers = [
  { key: "top", label: "Salida", hint: "Los primeros minutos" },
  { key: "heart", label: "Corazón", hint: "Cuando se asienta" },
  { key: "base", label: "Fondo", hint: "Lo que queda en la piel" },
] as const;

/**
 * Notas de salida, corazón y fondo (CA-3.1) contadas como el perfume
 * evoluciona en la piel (spec 002, P1).
 */
export function NotesPyramid({ notes }: { notes: Product["notes"] }) {
  return (
    <dl className={`${styles.track} grid gap-10`}>
      <span aria-hidden className={styles.rail} />
      <span aria-hidden className={styles.fill} />
      {tiers.map((tier) => (
        <div key={tier.key} className={`${styles.tier} relative`}>
          <span aria-hidden className={styles.dot} />
          <dt className="flex items-baseline gap-3">
            <span className="text-lg">{tier.label}</span>
            <span className="text-sm text-text-muted">{tier.hint}</span>
          </dt>
          <dd className="mt-2 font-display text-[26px] leading-snug text-text/95 md:text-[30px]">
            {formatList(notes[tier.key])}
          </dd>
        </div>
      ))}
    </dl>
  );
}
