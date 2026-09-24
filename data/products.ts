import type { CatalogEntry, Product } from "@/types/product";

/**
 * CATÁLOGO DE PERFUMES
 *
 * Lo que puedes cambiar tú fácilmente está al inicio de cada perfume:
 *
 *   price:     precio del decant de 10 ml, en pesos (solo el número, sin $ ni comas)
 *   available: true = disponible · false = agotado (se sigue viendo, con el
 *              botón "Avisarme cuando vuelva")
 *   featured:  true = aparece en el carrusel de la portada · false = solo en el catálogo
 *
 * Al editar, conserva las comillas y las comas. Si algo queda mal escrito,
 * Netlify no publica y la web sigue mostrando la versión anterior.
 *
 * El resto de los datos (notas, descripción, fuentes) está verificado con
 * fuentes confiables (ver "sources"); para agregar perfumes usa el comando
 * /nuevo-perfume en Claude Code.
 */
const entries: CatalogEntry[] = [
  {
    slug: "dumont-nitro-red-edp",
    name: "Nitro Red",
    brand: "Dumont",
    // ─── Lo que puedes cambiar ───
    price: 100,
    available: true,
    featured: true,
    // ─────────────────────────────
    concentration: "EDP",
    family: "aromatico",
    gender: "masculino",
    tagline: "Manzana, lavanda y bergamota sobre un fondo de sándalo y ámbar.",
    description:
      "Dumont lo presenta como una mezcla de sándalo, bergamota y ámbar tan intensa como el rojo de su frasco. Abre fresco con manzana, lavanda y bergamota, pasa a un corazón de sandía, cedro y cálamo, y termina en un fondo cálido de ámbar, sándalo y pachulí. Se clasifica como aromático afrutado.",
    highlightNotes: ["Bergamota", "Sándalo", "Ámbar"],
    year: 2020,
    sources: [
      { label: "Dumont Paris: Nitro Red", url: "https://www.dumontparis.com/product/nitro-red/" },
      { label: "Fragrantica: Nitro Red", url: "https://www.fragrantica.com/perfume/Dumont/Nitro-Red-73023.html" },
      { label: "Cosmetics Now: Nitro Red Eau de Parfum", url: "https://www.cosmeticsnow.com/iteminfo/dumont-paris-dumont-nitro-red-eau-de-parfum-spray-100ml" },
    ],
    notes: {
      top: ["Manzana", "Lavanda", "Bergamota"],
      heart: ["Sandía", "Cedro", "Cálamo"],
      base: ["Ámbar", "Sándalo", "Pachulí"],
    },
    images: {
      bottle: "/products/dumont-nitro-red-edp/bottle.webp",
      decant: "/products/dumont-nitro-red-edp/decant.webp",
      scene: "/products/dumont-nitro-red-edp/scene.webp",
    },
    atmosphere: { base: "#2a0c10", glow: "#e2474f" },
    profile: { moment: "siempre", character: ["fresco", "calido"] },
  },
  {
    slug: "armaf-club-de-nuit-urban-man-elixir-edp",
    name: "Club de Nuit Urban Man Elixir",
    brand: "Armaf",
    // ─── Lo que puedes cambiar ───
    price: 100,
    available: true,
    featured: true,
    // ─────────────────────────────
    concentration: "EDP",
    family: "oriental",
    gender: "masculino",
    tagline: "Bergamota y pimienta rosa, azafrán y un fondo de ambroxan y ámbar.",
    description:
      "Armaf lo presenta como un ámbar profundo y de sofisticación atemporal. Abre con un golpe cítrico y especiado de bergamota y pimienta rosa, suavizado por jazmín y azahar; el corazón reúne lavanda, geranio, elemí y tagetes con la calidez del azafrán, y el fondo se asienta en ambroxan, ámbar, cedro, pachulí y ládano.",
    highlightNotes: ["Pimienta rosa", "Azafrán", "Ambroxan"],
    year: 2022,
    sources: [
      { label: "Armaf: Club de Nuit Urban Man Elixir", url: "https://armaf.com/products/club-de-nuit-urban-elixir-100ml" },
      { label: "Fragrantica: Club de Nuit Urban Elixir", url: "https://www.fragrantica.com/perfume/Armaf/Club-De-Nuit-Urban-Elixir-77860.html" },
      { label: "Parfumo: Club de Nuit Urban Man Elixir", url: "https://www.parfumo.com/Perfumes/Armaf/club-de-nuit-urban-man-elixir" },
    ],
    notes: {
      top: ["Bergamota", "Pimienta rosa", "Azahar", "Jazmín"],
      heart: ["Lavanda", "Tagetes", "Geranio", "Vetiver", "Elemí", "Azafrán"],
      base: ["Ambroxan", "Ámbar", "Pachulí", "Cedro", "Ládano"],
    },
    images: {
      bottle: "/products/armaf-club-de-nuit-urban-man-elixir-edp/bottle.webp",
      decant: "/products/armaf-club-de-nuit-urban-man-elixir-edp/decant.webp",
      scene: "/products/armaf-club-de-nuit-urban-man-elixir-edp/scene.webp",
    },
    atmosphere: { base: "#16161b", glow: "#cfa75e" },
    profile: { moment: "noche", character: ["calido", "especiado"] },
  },
  {
    slug: "lattafa-qaed-al-fursan-edp",
    name: "Qaed Al Fursan",
    brand: "Lattafa",
    // ─── Lo que puedes cambiar ───
    price: 100,
    available: true,
    featured: true,
    // ─────────────────────────────
    concentration: "EDP",
    family: "aromatico",
    gender: "unisex",
    tagline: "Piña y azafrán sobre un fondo de oud, cedro y ámbar.",
    description:
      "Lattafa lo presenta como un aromático para hombre y mujer, construido sobre el contraste entre lo tropical y lo amaderado. Abre con azafrán y una piña jugosa; el corazón combina jazmín y bálsamo de abeto, y el fondo se asienta en madera de oud, cedro y ámbar.",
    highlightNotes: ["Piña", "Azafrán", "Oud"],
    year: 2016,
    sources: [
      { label: "Lattafa: Qaed Al Fursan", url: "https://lattafa.com/product/qaed-al-fursan/" },
      { label: "Lattafa USA: Qaed Al Fursan", url: "https://www.lattafa-usa.com/products/qaed-al-fursan" },
      { label: "Fragrantica: Qaed Al Fursan", url: "https://www.fragrantica.com/perfume/Lattafa-Perfumes/Qaed-Al-Fursan-67996.html" },
    ],
    notes: {
      top: ["Azafrán", "Piña"],
      heart: ["Jazmín", "Bálsamo de abeto"],
      base: ["Madera de oud", "Cedro", "Ámbar"],
    },
    images: {
      bottle: "/products/lattafa-qaed-al-fursan-edp/bottle.webp",
      decant: "/products/lattafa-qaed-al-fursan-edp/decant.webp",
      scene: "/products/lattafa-qaed-al-fursan-edp/scene.webp",
    },
    atmosphere: { base: "#15130a", glow: "#c89b3c" },
    profile: { moment: "siempre", character: ["especiado", "calido"] },
  },
  {
    slug: "lattafa-pride-art-of-universe-edp",
    name: "Art of Universe",
    brand: "Lattafa Pride",
    // ─── Lo que puedes cambiar ───
    price: 100,
    available: true,
    featured: true,
    // ─────────────────────────────
    concentration: "EDP",
    family: "citrico",
    gender: "masculino",
    tagline: "Bergamota, jengibre y menta con una pera jugosa sobre cedro y ámbar.",
    description:
      "Lattafa lo presenta como un cítrico aromático lleno de energía y elegancia. Abre con un estallido fresco de bergamota y mandarina, avivado por el jengibre y la menta; el corazón suma azahar y una pera jugosa, y el fondo se asienta en cedro, ámbar y almizcle.",
    highlightNotes: ["Bergamota", "Jengibre", "Pera"],
    year: 2025,
    sources: [
      { label: "Lattafa: Art of Universe", url: "https://lattafa.com/product/art-of-universe/" },
      { label: "Lattafa USA: Art of Universe", url: "https://www.lattafa-usa.com/products/art-of-universe" },
      { label: "Fragrantica: Art of Universe", url: "https://www.fragrantica.com/perfume/Lattafa-Perfumes/Art-Of-Universe-101314.html" },
      { label: "Parfumo: Art of Universe", url: "https://www.parfumo.com/Perfumes/lattafa-pride/art-of-universe" },
    ],
    notes: {
      top: ["Bergamota", "Mandarina", "Jengibre", "Menta"],
      heart: ["Azahar", "Pera"],
      base: ["Cedro", "Ámbar", "Almizcle"],
    },
    images: {
      bottle: "/products/lattafa-pride-art-of-universe-edp/bottle.webp",
      decant: "/products/lattafa-pride-art-of-universe-edp/decant.webp",
      scene: "/products/lattafa-pride-art-of-universe-edp/scene.webp",
    },
    atmosphere: { base: "#0c1233", glow: "#7fa6f5" },
    profile: { moment: "dia", character: ["fresco"] },
  },
];

export const products: Product[] = entries.map(({ price, presentations, ...rest }) => ({
  ...rest,
  presentations: presentations ?? [{ ml: 10, price }],
}));
