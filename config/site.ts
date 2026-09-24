/**
 * Configuración del negocio (plan §4). Todo lo que el dueño podría cambiar
 * sin tocar componentes vive aquí.
 */
export const site = {
  /** Nombre provisional (spec §8): se reemplaza cuando haya nombre definitivo. */
  brandName: "Fracción",
  /**
   * Dirección pública del sitio: la usan las vistas previas al compartir por
   * WhatsApp, el mapa del sitio y los enlaces canónicos. Si cambias de
   * dominio, cámbiala aquí (o define NEXT_PUBLIC_SITE_URL).
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://stellar-arithmetic-94d21b.netlify.app",
  /** Texto gigante detrás del frasco en el hero. */
  wordmark: "Fracción",
  /** Formato internacional sin "+" ni espacios. */
  whatsappNumber: "526678562243",
  locality: "Higuera de Zaragoza, Sinaloa",
  /** Opcionales: si están vacíos no se muestran (CA-5.4). */
  schedule: undefined as string | undefined,
  instagram: undefined as string | undefined,
  currency: "MXN",
  locale: "es-MX",
  /** Tamaño de decant que se muestra por defecto (hoy el único). */
  defaultSize: 10,
} as const;
