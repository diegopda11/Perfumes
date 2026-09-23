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

export type Moment = "dia" | "noche" | "siempre";
export type Character = "fresco" | "floral" | "calido" | "especiado";

/** Colores de la página de detalle del perfume (spec 002, P1). */
export interface Atmosphere {
  /** Fondo oscuro teñido; el texto claro debe mantener contraste AA. */
  base: string;
  /** Color de la luz sobre el frasco. */
  glow: string;
}

/** Datos para "Encuentra tu perfume" (spec 002, P7). */
export interface ScentProfile {
  moment: Moment;
  character: Character[];
}

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
  /** Si falta, el detalle usa los colores de la marca. */
  atmosphere?: Atmosphere;
  /** Si falta, se deduce de la familia olfativa (lib/finder.ts). */
  profile?: ScentProfile;
  /** Aparece en el carrusel del hero. */
  featured?: boolean;
  /** Por defecto true. */
  available?: boolean;
  isMock?: boolean;
}
