import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sitio 100% estático (plan §1): `next build` genera la carpeta `out/`.
  output: "export",
  // Las imágenes ya salen optimizadas del pipeline propio (scripts/photos).
  images: { unoptimized: true },
};

export default nextConfig;
