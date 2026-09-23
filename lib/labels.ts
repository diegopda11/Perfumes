import type { Concentration, Gender, OlfactoryFamily } from "@/types/product";

/** Orden canónico de las familias en los filtros. */
export const familyLabels: Record<OlfactoryFamily, string> = {
  floral: "Floral",
  chipre: "Chipre",
  oriental: "Ámbar",
  amaderado: "Amaderado",
  aromatico: "Aromático",
  citrico: "Cítrico",
  fresco: "Fresco",
  gourmand: "Gourmand",
};

export const genderLabels: Record<Gender, string> = {
  femenino: "Femenino",
  masculino: "Masculino",
  unisex: "Unisex",
};

export const concentrationLabels: Record<Concentration, string> = {
  EDT: "Eau de toilette",
  EDP: "Eau de parfum",
  Extrait: "Extrait de parfum",
  Parfum: "Parfum",
};
