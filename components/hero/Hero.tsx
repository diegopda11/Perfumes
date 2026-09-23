import { site } from "@/config/site";
import { getFeatured, getPrice } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { HeroCarousel, type HeroSlide } from "./HeroCarousel";
import { IntroVial } from "./IntroVial";
import { LivingLight } from "./LivingLight";
import { Spotlight } from "./Spotlight";

/** Hero vitrina (HU-1): luz, wordmark detrás y el frasco como protagonista. */
export function Hero() {
  const slides: HeroSlide[] = getFeatured().map((p) => ({
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    tagline: p.tagline,
    price: formatPrice(getPrice(p)),
    bottle: p.images.bottle,
    decant: p.images.decant,
  }));

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      // Un poco menos que la pantalla completa: se asoma el catálogo y
      // queda claro que hay más abajo.
      className="relative isolate h-[90svh] max-h-[1000px] min-h-[580px] overflow-hidden"
    >
      <Spotlight />
      <LivingLight targetId="hero" />

      {/* Qué vendemos, dicho una sola vez y en voz baja */}
      <h1
        id="hero-title"
        data-intro="ui"
        className="absolute inset-x-4 top-[max(76px,10svh)] z-10 text-center text-[15px] text-text/70 md:top-[max(100px,11svh)] md:text-base"
      >
        Perfumes originales en decants de 10 ml
      </h1>

      <p
        aria-hidden
        translate="no"
        className="hero-wordmark pointer-events-none absolute inset-x-0 top-[20svh] z-0 text-center font-display text-[25vw] leading-[0.8] whitespace-nowrap text-text/[0.13] select-none md:top-[17svh] md:text-[min(17vw,280px)]"
      >
        {site.wordmark}
      </p>

      <IntroVial />
      {slides.length > 0 && <HeroCarousel slides={slides} />}
    </section>
  );
}
