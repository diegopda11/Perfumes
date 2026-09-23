/**
 * Configuración del negocio (plan §4). Todo lo que el dueño podría cambiar
 * sin tocar componentes vive aquí.
 */
export const site = {
  /** Nombre provisional (spec §8): se reemplaza cuando haya nombre definitivo. */
  brandName: "Fracción",
  /** Texto gigante detrás del frasco en el hero. */
  wordmark: "Fracción",
  /** Formato internacional sin "+" ni espacios. Pendiente del dueño. */
  whatsappNumber: "52XXXXXXXXXX",
  locality: "Higuera de Zaragoza, Sinaloa",
  /** Opcionales: si están vacíos no se muestran (CA-5.4). */
  schedule: undefined as string | undefined,
  instagram: undefined as string | undefined,
  currency: "MXN",
  locale: "es-MX",
  /** Tamaño de decant que se muestra por defecto (hoy el único). */
  defaultSize: 10,
} as const;
