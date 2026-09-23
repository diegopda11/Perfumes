import type { Product } from "@/types/product";

/**
 * Catálogo real. Para agregar un perfume: copia una entrada, cambia los
 * datos y coloca sus imágenes en public/products/<slug>/.
 *
 * PENDIENTE (spec §8): los precios son provisionales, las notas deben
 * verificarse con la caja y falta confirmar la concentración de Coco
 * Mademoiselle y Libre.
 */
export const products: Product[] = [
  {
    slug: "dior-sauvage-edp",
    name: "Sauvage",
    brand: "Dior",
    concentration: "EDP",
    family: "aromatico",
    gender: "masculino",
    tagline: "Pimienta fresca, ámbar magnético y una estela que no pasa desapercibida.",
    description:
      "Abre con una bergamota jugosa y se vuelve cálido y especiado. En el fondo, el ambroxan y la vainilla dejan una estela limpia y magnética que dura todo el día.",
    idealFor: "Día o noche, todo el año. Funciona igual en la oficina que en una cena.",
    highlightNotes: ["Bergamota", "Pimienta de Sichuan", "Ambroxan"],
    notes: {
      top: ["Bergamota"],
      heart: ["Pimienta de Sichuan", "Lavanda", "Anís estrellado", "Nuez moscada"],
      base: ["Ambroxan", "Vainilla"],
    },
    presentations: [{ ml: 10, price: 450 }],
    images: {
      bottle: "/products/dior-sauvage-edp/bottle.webp",
      decant: "/products/dior-sauvage-edp/decant.webp",
      scene: "/products/dior-sauvage-edp/scene.webp",
    },
    featured: true,
  },
  {
    slug: "chanel-coco-mademoiselle-edp",
    name: "Coco Mademoiselle",
    brand: "Chanel",
    concentration: "EDP",
    family: "chipre",
    gender: "femenino",
    tagline: "Naranja luminosa, rosa y jazmín sobre un pachulí que se queda.",
    description:
      "Empieza fresco y chispeante, con cítricos brillantes. Luego florece en rosa y jazmín, y se asienta en un pachulí elegante con un toque de vainilla.",
    idealFor: "Días especiales y noches elegantes. Brilla sobre todo en primavera y otoño.",
    highlightNotes: ["Naranja", "Rosa", "Pachulí"],
    notes: {
      top: ["Naranja", "Bergamota", "Toronja"],
      heart: ["Rosa", "Jazmín", "Lichi"],
      base: ["Pachulí", "Vetiver", "Vainilla", "Almizcle blanco"],
    },
    presentations: [{ ml: 10, price: 480 }],
    images: {
      bottle: "/products/chanel-coco-mademoiselle-edp/bottle.webp",
      decant: "/products/chanel-coco-mademoiselle-edp/decant.webp",
      scene: "/products/chanel-coco-mademoiselle-edp/scene.webp",
    },
    featured: true,
  },
  {
    slug: "ysl-libre-edp",
    name: "Libre",
    brand: "Yves Saint Laurent",
    concentration: "EDP",
    family: "floral",
    gender: "femenino",
    tagline: "Lavanda con carácter, azahar radiante y una vainilla que abraza.",
    description:
      "La lavanda deja de ser tímida: aquí es audaz y sensual. El azahar le da luz y la vainilla de Madagascar la envuelve en un fondo cálido y adictivo.",
    idealFor: "Salidas de noche y días frescos. Su calidez luce más en otoño e invierno.",
    highlightNotes: ["Lavanda", "Azahar", "Vainilla"],
    notes: {
      top: ["Lavanda", "Mandarina", "Grosella negra"],
      heart: ["Lavanda", "Azahar", "Jazmín"],
      base: ["Vainilla", "Almizcle", "Cedro", "Ámbar gris"],
    },
    presentations: [{ ml: 10, price: 450 }],
    images: {
      bottle: "/products/ysl-libre-edp/bottle.webp",
      decant: "/products/ysl-libre-edp/decant.webp",
      scene: "/products/ysl-libre-edp/scene.webp",
    },
    featured: true,
  },
];
