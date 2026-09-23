import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getProducts } from "@/lib/catalog";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const products = getProducts().filter((p) => !p.isMock);
  return [
    { url: `${site.url}/`, changeFrequency: "weekly", priority: 1 },
    ...products.map((p) => ({
      url: `${site.url}/producto/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
