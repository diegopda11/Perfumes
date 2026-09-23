import { site } from "@/config/site";
import { getFeatured, getPrice } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { HeroCarousel, type HeroSlide } from "./HeroCarousel";
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
      aria-labelledby="hero-title"
      className="relative isolate h-svh max-h-[1100px] min-h-[600px] overflow-hidden"
    >
      <Spotlight />

      <p
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[19svh] z-0 text-center font-display text-[25vw] leading-[0.8] whitespace-nowrap text-text/[0.13] select-none md:top-[15svh] md:text-[min(17vw,280px)]"
      >
        {site.wordmark}
      </p>

      <h1 id="hero-title" className="sr-only">
        {site.brandName}: decants de 10 ml de perfumes originales
      </h1>

      {slides.length > 0 && <HeroCarousel slides={slides} />}
    </section>
  );
}
