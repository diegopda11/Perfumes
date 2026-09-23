import { CatalogSection } from "@/components/catalog/CatalogSection";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { HowItWorks } from "@/components/sections/HowItWorks";

export default function Home() {
  return (
    <main>
      <Hero />
      <CatalogSection />
      <HowItWorks />
      <About />
    </main>
  );
}
