import type { Product } from "@/types/product";

/**
 * Perfumes FICTICIOS para probar cómo se comporta el diseño con un catálogo
 * grande (CLAUDE.md). Solo aparecen con NEXT_PUBLIC_INCLUDE_MOCKS=true;
 * producción nunca los muestra.
 */
type MockSeed = Pick<Product, "name" | "brand" | "family" | "gender" | "tagline" | "highlightNotes"> & {
  bottle: string;
  price: number;
  available?: boolean;
};

const seeds: MockSeed[] = [
  { name: "Noche de Copal", brand: "Casa Ámbar", family: "amaderado", gender: "unisex", tagline: "Copal ahumado, cuero tibio y un vetiver que no se va.", highlightNotes: ["Copal", "Cuero", "Vetiver"], bottle: "humo", price: 420 },
  { name: "Iris Nocturno", brand: "Atelier Bruma", family: "floral", gender: "femenino", tagline: "Iris empolvado sobre almizcle limpio y madera clara.", highlightNotes: ["Iris", "Almizcle", "Cedro"], bottle: "cielo", price: 390 },
  { name: "Rosa Velada", brand: "Casa Ámbar", family: "floral", gender: "femenino", tagline: "Rosa oscura, oud suave y un ámbar que se queda en la piel.", highlightNotes: ["Rosa", "Oud", "Ámbar"], bottle: "rosa", price: 460 },
  { name: "Brisa de Mar", brand: "Litoral", family: "fresco", gender: "masculino", tagline: "Sal marina, limón verde y una madera blanca que refresca.", highlightNotes: ["Sal marina", "Limón", "Madera blanca"], bottle: "cielo", price: 350 },
  { name: "Tabaco Dorado", brand: "Atelier Bruma", family: "oriental", gender: "masculino", tagline: "Hoja de tabaco, miel oscura y un fondo de haba tonka.", highlightNotes: ["Tabaco", "Miel", "Haba tonka"], bottle: "ambar", price: 480, available: false },
  { name: "Higo Verde", brand: "Litoral", family: "aromatico", gender: "unisex", tagline: "Hoja de higuera, leche de coco y un verde que despierta.", highlightNotes: ["Higo", "Coco", "Hojas verdes"], bottle: "verde", price: 380 },
  { name: "Vainilla Negra", brand: "Casa Ámbar", family: "gourmand", gender: "femenino", tagline: "Vainilla ahumada, caramelo tostado y un toque de café.", highlightNotes: ["Vainilla", "Caramelo", "Café"], bottle: "noche", price: 440 },
  { name: "Mandarina Solar", brand: "Litoral", family: "citrico", gender: "unisex", tagline: "Mandarina jugosa, neroli y un almizcle que ilumina.", highlightNotes: ["Mandarina", "Neroli", "Almizcle"], bottle: "ambar", price: 340 },
  { name: "Cedro Nevado", brand: "Atelier Bruma", family: "amaderado", gender: "masculino", tagline: "Cedro del Atlas, pimienta rosa y un incienso frío.", highlightNotes: ["Cedro", "Pimienta rosa", "Incienso"], bottle: "verde", price: 410 },
  { name: "Musgo de Seda", brand: "Casa Ámbar", family: "chipre", gender: "femenino", tagline: "Bergamota, rosa y un musgo de roble aterciopelado.", highlightNotes: ["Bergamota", "Rosa", "Musgo"], bottle: "humo", price: 470 },
  { name: "Lavanda Azul", brand: "Litoral", family: "aromatico", gender: "masculino", tagline: "Lavanda fresca, salvia y una base limpia de almizcle.", highlightNotes: ["Lavanda", "Salvia", "Almizcle"], bottle: "noche", price: 360, available: false },
  { name: "Ámbar Líquido", brand: "Atelier Bruma", family: "oriental", gender: "unisex", tagline: "Ámbar resinoso, benjuí y una vainilla profunda.", highlightNotes: ["Ámbar", "Benjuí", "Vainilla"], bottle: "ambar", price: 450 },
];

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const mockProducts: Product[] = seeds.map((s) => ({
  slug: `demo-${slugify(s.name)}`,
  name: s.name,
  brand: s.brand,
  concentration: "EDP",
  family: s.family,
  gender: s.gender,
  tagline: s.tagline,
  description: `${s.tagline} Perfume ficticio para pruebas de diseño.`,
  highlightNotes: s.highlightNotes,
  notes: {
    top: [s.highlightNotes[0]],
    heart: [s.highlightNotes[1]],
    base: [s.highlightNotes[2] ?? s.highlightNotes[1]],
  },
  presentations: [{ ml: 10, price: s.price }],
  images: { bottle: `/mock/${s.bottle}.svg`, decant: "/mock/decant.svg" },
  available: s.available,
  isMock: true,
}));
