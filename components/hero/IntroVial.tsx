"use client";

import { useEffect } from "react";

/** Duración total de la entrada (CA-P3.1). Debe coincidir con globals.css. */
const INTRO_MS = 3200;

/**
 * "La fracción se llena" (spec 002, P3): el vial se dibuja en latón, se
 * llena hasta 10 ml y cede el lugar al frasco. Solo se ve si el script de
 * <head> marcó html.intro (al abrir la portada, sin movimiento
 * reducido). Al terminar se quita la marca para que la animación no se
 * repita al volver a la portada.
 */
export function IntroVial() {
  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("intro")) return;
    const skipEvents = ["pointerdown", "keydown", "wheel", "touchmove"] as const;
    const end = () => {
      html.classList.remove("intro");
      skipEvents.forEach((type) => removeEventListener(type, end));
    };
    // Cualquier interacción la salta: nadie debería esperar para usar el sitio.
    skipEvents.forEach((type) => addEventListener(type, end, { passive: true }));
    // Sin limpieza del temporizador a propósito: quitar la clase es
    // idempotente y así la entrada termina aunque el componente se remonte.
    window.setTimeout(end, INTRO_MS + 100);
  }, []);

  return (
    <div aria-hidden className="intro-vial pointer-events-none absolute left-1/2 z-20 -translate-x-1/2">
      <svg viewBox="0 0 60 190" fill="none" className="h-auto w-[60px] md:w-[84px]">
        <path
          className="intro-vial__stroke"
          pathLength={1}
          d="M22 4h16a3 3 0 0 1 3 3v30H19V7a3 3 0 0 1 3-3ZM16 37h28a6 6 0 0 1 6 6v134a8 8 0 0 1-8 8H18a8 8 0 0 1-8-8V43a6 6 0 0 1 6-6Z"
          stroke="var(--color-accent-lit)"
          strokeWidth="1.2"
        />
        <rect className="intro-vial__liquid" x="14" y="88" width="32" height="92" rx="5" fill="var(--color-accent-lit)" />
      </svg>
      <span className="intro-vial__label mt-3 block text-center text-sm tracking-wide text-accent-lit">10 ml</span>
    </div>
  );
}
