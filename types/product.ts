export type Concentration = "EDT" | "EDP" | "Extrait" | "Parfum";
export type Gender = "femenino" | "masculino" | "unisex";
export type OlfactoryFamily =
  | "amaderado"
  | "floral"
  | "oriental"
  | "citrico"
  | "fresco"
  | "gourmand"
  | "aromatico"
  | "chipre";

export interface Presentation {
  /** Mililitros. Hoy siempre 10. */
  ml: number;
  /** Pesos mexicanos, entero, sin centavos. */
  price: number;
}

export interface Product {
  slug: string;
  name: string;
  brand: string;
  concentration: Concentration;
  family: OlfactoryFamily;
  gender: Gender;
  /** Frase evocadora corta, para el hero y las tarjetas. */
  tagline: string;
  description: string;
  /** Ocasión y temporada sugeridas, en tono evocador. Opcional. */
  idealFor?: string;
  highlightNotes: [string, string] | [string, string, string];
  notes: { top: string[]; heart: string[]; base: string[] };
  /** Al menos una; la interfaz de hoy usa la primera. */
  presentations: [Presentation, ...Presentation[]];
  images: {
    /** Frasco recortado, sin fondo. */
    bottle: string;
    /** Decant recortado, sin fondo. */
    decant?: string;
    /** Escena con frasco y decant juntos. */
    scene?: string;
  };
  /** Aparece en el carrusel del hero. */
  featured?: boolean;
  /** Por defecto true. */
  available?: boolean;
  isMock?: boolean;
}
