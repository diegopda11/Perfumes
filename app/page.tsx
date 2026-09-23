import { CatalogSection } from "@/components/catalog/CatalogSection";
import { FinderSection } from "@/components/finder/FinderSection";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { HowItWorks } from "@/components/sections/HowItWorks";

export default function Home() {
  return (
    <main>
      <Hero />
      <CatalogSection />
      <FinderSection />
      <HowItWorks />
      <About />
    </main>
  );
}
