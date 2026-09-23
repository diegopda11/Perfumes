import { isAvailable } from "@/lib/catalog";
import type { Character, Moment, OlfactoryFamily, Product, ScentProfile } from "@/types/product";

/** Respuestas de "Encuentra tu perfume" (spec 002, P7). */
export type ForWhom = "ella" | "el" | "cualquiera";

export interface FinderAnswers {
  para?: ForWhom;
  momento?: Moment;
  caracter?: Character;
}

const characterByFamily: Record<OlfactoryFamily, Character[]> = {
  floral: ["floral"],
  chipre: ["floral", "calido"],
  oriental: ["calido", "especiado"],
  amaderado: ["calido"],
  aromatico: ["fresco", "especiado"],
  citrico: ["fresco"],
  fresco: ["fresco"],
  gourmand: ["calido"],
};

/** El perfil declarado del perfume o, si falta, uno deducido de su familia. */
export function profileOf(product: Product): ScentProfile {
  return product.profile ?? { moment: "siempre", character: characterByFamily[product.family] };
}

function genderScore(product: Product, para: ForWhom | undefined): number {
  if (!para || para === "cualquiera") return 0;
  const wanted = para === "ella" ? "femenino" : "masculino";
  if (product.gender === wanted) return 3;
  if (product.gender === "unisex") return 2;
  return -Infinity; // nunca recomendar un perfume de otro género si lo pidieron
}

function momentScore(profile: ScentProfile, momento: Moment | undefined): number {
  if (!momento) return 0;
  if (profile.moment === momento) return 2;
  return profile.moment === "siempre" || momento === "siempre" ? 1 : 0;
}

export function scoreProduct(product: Product, answers: FinderAnswers): number {
  const profile = profileOf(product);
  const character = answers.caracter && profile.character.includes(answers.caracter) ? 3 : 0;
  return genderScore(product, answers.para) + momentScore(profile, answers.momento) + character;
}

/**
 * Los `max` perfumes disponibles que mejor encajan con las respuestas. En
 * caso de empate se respeta el orden del catálogo.
 */
export function recommend(products: Product[], answers: FinderAnswers, max = 2): Product[] {
  return products
    .filter(isAvailable)
    .map((product, index) => ({ product, index, score: scoreProduct(product, answers) }))
    .filter((entry) => Number.isFinite(entry.score))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, max)
    .map((entry) => entry.product);
}
