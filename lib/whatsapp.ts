import { site } from "@/config/site";

export type WhatsAppIntent = "consulta" | "aviso";

/**
 * Enlace wa.me con el mensaje precargado (CA-4.2, CA-4.5). Es el único
 * lugar del sitio que arma enlaces de WhatsApp (CA-4.4).
 */
export function buildWhatsAppUrl(
  perfumeName: string,
  intent: WhatsAppIntent = "consulta",
  { number = site.whatsappNumber, ml = site.defaultSize }: { number?: string; ml?: number } = {},
): string {
  const message =
    intent === "consulta"
      ? `Hola, me interesa el decant de ${ml}ml de ${perfumeName}`
      : `Hola, ¿me avisas cuando vuelva a estar disponible el decant de ${ml}ml de ${perfumeName}?`;
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
