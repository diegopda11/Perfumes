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
    slug: "dior-sauvage-edp",
    name: "Sauvage",
    brand: "Dior",
    // ─── Lo que puedes cambiar ───
    price: 450,
    available: true,
    featured: true,
    // ─────────────────────────────
    concentration: "EDP",
    family: "aromatico",
    gender: "masculino",
    tagline: "Bergamota de Calabria, especias y una vainilla envolvente con estela de ambroxan.",
    description:
      "Dior se inspiró en el desierto a la hora del crepúsculo, cuando el aire ardiente se mezcla con el frescor de la noche. Una bergamota de Calabria jugosa y especiada abre paso a la pimienta de Sichuan, la lavanda, el anís estrellado y la nuez moscada, y el fondo se asienta en un extracto de vainilla de Papúa Nueva Guinea y ambroxan. Frente al Eau de Toilette, esta versión es más envolvente y sensual.",
    highlightNotes: ["Bergamota", "Pimienta de Sichuan", "Vainilla"],
    perfumer: "François Demachy",
    year: 2018,
    sources: [
      { label: "Dior: Sauvage Eau de Parfum", url: "https://www.dior.com/en_us/beauty/products/sauvage-eau-de-parfum-Y0785220.html" },
      { label: "Fragrantica: Sauvage Eau de Parfum", url: "https://www.fragrantica.com/perfume/Dior/Sauvage-Eau-de-Parfum-48100.html" },
      { label: "Fragrantica: lanzamiento de Sauvage Eau de Parfum", url: "https://www.fragrantica.com/news/Dior-Sauvage-Eau-de-Parfum-10382.html" },
    ],
    notes: {
      top: ["Bergamota de Calabria"],
      heart: ["Pimienta de Sichuan", "Lavanda", "Anís estrellado", "Nuez moscada"],
      base: ["Ambroxan", "Vainilla de Papúa Nueva Guinea"],
    },
    images: {
      bottle: "/products/dior-sauvage-edp/bottle.webp",
      decant: "/products/dior-sauvage-edp/decant.webp",
      scene: "/products/dior-sauvage-edp/scene.webp",
    },
    atmosphere: { base: "#0b1a33", glow: "#5a8fd6" },
    profile: { moment: "siempre", character: ["fresco", "especiado"] },
  },
  {
    slug: "chanel-coco-mademoiselle-edp",
    name: "Coco Mademoiselle",
    brand: "Chanel",
    // ─── Lo que puedes cambiar ───
    price: 480,
    available: true,
    featured: true,
    // ─────────────────────────────
    concentration: "EDP",
    family: "oriental",
    gender: "femenino",
    tagline: "Naranja vibrante, jazmín y rosa de mayo sobre pachulí y vetiver.",
    description:
      "Chanel lo describe como un ámbar amaderado atrevido y sorprendentemente fresco, que evoca a una Coco Chanel joven y audaz. Abre con una naranja vibrante, revela en el corazón un acorde transparente de jazmín y rosa de mayo, y termina con acentos refinados de pachulí y vetiver.",
    highlightNotes: ["Naranja", "Rosa de mayo", "Pachulí"],
    perfumer: "Jacques Polge",
    year: 2001,
    sources: [
      { label: "Chanel: Coco Mademoiselle Eau de Parfum", url: "https://www.chanel.com/us/fragrance/p/116520/coco-mademoiselle-eau-de-parfum-spray/" },
      { label: "Wikipedia: Coco Mademoiselle", url: "https://en.wikipedia.org/wiki/Coco_Mademoiselle" },
      { label: "Sephora: Coco Mademoiselle Eau de Parfum", url: "https://www.sephora.com/product/coco-mademoiselle-P12495" },
    ],
    notes: {
      top: ["Naranja"],
      heart: ["Jazmín", "Rosa de mayo"],
      base: ["Pachulí", "Vetiver"],
    },
    images: {
      bottle: "/products/chanel-coco-mademoiselle-edp/bottle.webp",
      decant: "/products/chanel-coco-mademoiselle-edp/decant.webp",
      scene: "/products/chanel-coco-mademoiselle-edp/scene.webp",
    },
    atmosphere: { base: "#2a1611", glow: "#eba986" },
    profile: { moment: "siempre", character: ["floral", "fresco"] },
  },
  {
    slug: "ysl-libre-edp",
    name: "Libre",
    brand: "Yves Saint Laurent",
    // ─── Lo que puedes cambiar ───
    price: 450,
    available: true,
    featured: true,
    // ─────────────────────────────
    concentration: "EDP",
    family: "floral",
    gender: "femenino",
    tagline: "Lavanda de Francia y azahar de Marruecos sobre vainilla de Madagascar.",
    description:
      "Yves Saint Laurent lo presenta como el perfume de la libertad y su primer «floral lavanda». Juega con la tensión entre la audacia de la lavanda de Francia, una nota tradicionalmente masculina, y la sensualidad del azahar de Marruecos, sobre una base cálida de vainilla de Madagascar y almizcle.",
    highlightNotes: ["Lavanda", "Azahar", "Vainilla"],
    perfumer: "Anne Flipo y Carlos Benaïm",
    year: 2019,
    sources: [
      { label: "YSL Beauty: Libre Eau de Parfum", url: "https://www.yslbeauty.com/int/fragrance/fragrance-for-her/libre/libre-eau-de-parfum/WW-50424YSL.html" },
      { label: "YSL Beauty: Libre, el perfume de la libertad", url: "https://www.yslbeauty.com/int/libre-lp.html" },
      { label: "Fragrantica: Libre", url: "https://www.fragrantica.com/perfume/Yves-Saint-Laurent/Libre-56077.html" },
    ],
    notes: {
      top: ["Lavanda", "Mandarina", "Grosella negra", "Petitgrain"],
      heart: ["Lavanda de Francia", "Azahar de Marruecos", "Jazmín"],
      base: ["Vainilla de Madagascar", "Almizcle", "Cedro", "Ámbar gris"],
    },
    images: {
      bottle: "/products/ysl-libre-edp/bottle.webp",
      decant: "/products/ysl-libre-edp/decant.webp",
      scene: "/products/ysl-libre-edp/scene.webp",
    },
    atmosphere: { base: "#241a08", glow: "#e6bf66" },
    profile: { moment: "noche", character: ["floral", "calido"] },
  },
  {
    slug: "azzaro-the-most-wanted-edp-intense",
    name: "The Most Wanted Intense",
    brand: "Azzaro",
    // ─── Lo que puedes cambiar ───
    price: 450,
    available: true,
    featured: true,
    // ─────────────────────────────
    concentration: "EDP",
    family: "oriental",
    gender: "masculino",
    tagline: "Cardamomo, un acorde de caramelo y madera ambarada.",
    description:
      "Azzaro lo define como un fougère amaderado ambarado, intenso y magnético. El cardamomo abre con energía junto a la mandarina, el corazón es un acorde adictivo de caramelo con lavanda y salvia esclarea, y el fondo combina madera ambarada, vainilla bourbon y vetiver.",
    highlightNotes: ["Cardamomo", "Caramelo", "Madera ambarada"],
    perfumer: "Michel Girard, Nadège Le Garlantezec y Shyamala Maisondieu",
    year: 2021,
    sources: [
      { label: "Azzaro: The Most Wanted Eau de Parfum Intense", url: "https://www.azzaro.com/en/fragrances/azzaro-the-most-wanted/eau-de-parfum-intense" },
      { label: "Ulta Beauty: The Most Wanted Eau de Parfum Intense", url: "https://www.ulta.com/p/most-wanted-eau-de-parfum-intense-pimprod2023922?sku=2579633" },
      { label: "Parfumo: The Most Wanted Eau de Parfum Intense", url: "https://www.parfumo.com/Perfumes/Azzaro/the-most-wanted-eau-de-parfum-intense" },
    ],
    notes: {
      top: ["Cardamomo", "Mandarina"],
      heart: ["Caramelo tostado", "Lavanda", "Salvia esclarea"],
      base: ["Madera ambarada", "Vainilla bourbon", "Vetiver"],
    },
    images: {
      bottle: "/products/azzaro-the-most-wanted-edp-intense/bottle.webp",
      decant: "/products/azzaro-the-most-wanted-edp-intense/decant.webp",
      scene: "/products/azzaro-the-most-wanted-edp-intense/scene.webp",
    },
    atmosphere: { base: "#1c0f0b", glow: "#e0874a" },
    profile: { moment: "noche", character: ["calido", "especiado"] },
  },
];

export const products: Product[] = entries.map(({ price, presentations, ...rest }) => ({
  ...rest,
  presentations: presentations ?? [{ ml: 10, price }],
}));
