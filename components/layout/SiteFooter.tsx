import Link from "next/link";
import { site } from "@/config/site";

/**
 * Footer y contacto (CA-5.3, CA-5.4, CA-6.3, RNF-7). Sin botón de WhatsApp:
 * el pedido se hace desde la página de cada perfume (CA-4.4).
 */
export function SiteFooter() {
  return (
    <footer id="contacto" className="scroll-mt-6 border-t border-glass-edge">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 pt-16 pb-10 md:grid-cols-[1.4fr_1fr_1fr] md:px-10 md:pt-20">
        <div>
          <p translate="no" className="font-display text-[40px] leading-none">{site.brandName}</p>
          <p className="mt-4 max-w-[36ch] text-text-muted">
            Perfumes originales en decants de 10 ml, para conocerlos a fondo antes de comprar el frasco.
          </p>
        </div>

        <div>
          <h2 className="text-sm text-text-muted">Dónde estamos</h2>
          <p className="mt-3 text-lg">{site.locality}</p>
          {site.schedule && <p className="mt-2 text-text-muted">{site.schedule}</p>}
          {site.instagram && (
            <a
              href={`https://instagram.com/${site.instagram.replace(/^@/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-accent-lit hover:underline"
            >
              @{site.instagram.replace(/^@/, "")}
            </a>
          )}
        </div>

        <div>
          <h2 className="text-sm text-text-muted">Cómo pedir</h2>
          <p className="mt-3 max-w-[34ch] leading-relaxed">
            Elige tu perfume en la{" "}
            <Link href="/#catalogo" className="text-accent-lit hover:underline">
              colección
            </Link>{" "}
            y toca «Consultar por WhatsApp» en su página. Coordinamos el pago y la entrega en persona.
          </p>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 border-t border-glass-edge px-4 py-8 text-sm text-text-muted md:flex-row md:justify-between md:px-10">
        <p className="max-w-[80ch]">
          Las marcas mencionadas pertenecen a sus respectivos dueños. No estamos afiliados a ellas:
          vendemos decants envasados de frascos originales.
        </p>
        <p className="shrink-0">
          © {new Date().getFullYear()} {site.brandName}
        </p>
      </div>
    </footer>
  );
}
