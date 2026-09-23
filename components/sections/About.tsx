import Image from "next/image";
import { site } from "@/config/site";
import { getFeatured } from "@/lib/catalog";

const reasons = [
  {
    title: "Conócelo de verdad",
    text: "Llévalo varios días, mira cómo cambia en tu piel y decide sin gastar en el frasco completo.",
  },
  {
    title: "Tamaño para llevar",
    text: "10 ml caben en cualquier bolsillo y rinden alrededor de cien atomizaciones.",
  },
  {
    title: "Siempre original",
    text: "Cada decant sale de un frasco auténtico que compramos completo.",
  },
];

/** "Nosotros" (CA-5.2): qué es un decant y quién está detrás. */
export function About() {
  const scene = getFeatured().find((p) => p.images.scene);

  return (
    <section id="nosotros" aria-labelledby="nosotros-title" className="scroll-mt-6 border-t border-glass-edge">
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-4 py-20 md:grid-cols-[1fr_1.1fr] md:gap-20 md:px-10 md:py-28">
        {scene?.images.scene && (
          <figure className="relative mx-auto w-full max-w-[380px] md:order-2 md:max-w-[420px]">
            <div className="relative aspect-[423/1024] max-h-[640px] overflow-hidden rounded-2xl border border-glass-edge">
              <Image
                src={scene.images.scene}
                alt={`Frasco original de ${scene.name} junto a su decant de 10 ml`}
                fill
                sizes="(min-width: 768px) 420px, 90vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-sm text-text-muted">
              El frasco original y el decant de 10 ml que te llevas.
            </figcaption>
          </figure>
        )}

        <div>
          <h2 id="nosotros-title" className="font-display text-[36px] leading-[1.05] md:text-[52px]">
            ¿Por qué un decant?
          </h2>
          <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-text-muted">
            Un decant es una porción de un perfume original, pasada de su frasco a un atomizador de
            10 ml. Somos un negocio local de {site.locality.split(",")[0]}: nos conoces en persona y
            te ayudamos a encontrar tu perfume.
          </p>
          <dl className="mt-10 grid gap-8">
            {reasons.map((reason) => (
              <div key={reason.title} className="border-l border-accent/60 pl-5">
                <dt className="text-lg">{reason.title}</dt>
                <dd className="mt-1 max-w-[46ch] leading-relaxed text-text-muted">{reason.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
