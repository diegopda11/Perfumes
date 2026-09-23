"use client";

import { useEffect } from "react";

/**
 * Luz viva (spec 002, P4): el haz y el brillo del vidrio siguen levemente
 * al puntero o a la inclinación del celular. Escribe --lx y --ly (de -1 a 1)
 * en el hero; el CSS decide cuánto se mueve cada capa. Suaviza con
 * requestAnimationFrame y se detiene cuando el hero no está en pantalla o
 * cuando el visitante prefiere menos movimiento.
 */
export function LivingLight({ targetId }: { targetId: string }) {
  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;
    let visible = true;

    const clamp = (v: number) => Math.max(-1, Math.min(1, v));

    const tick = () => {
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      el.style.setProperty("--lx", current.x.toFixed(4));
      el.style.setProperty("--ly", current.y.toFixed(4));
      const settled = Math.abs(target.x - current.x) < 0.001 && Math.abs(target.y - current.y) < 0.001;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };

    const aim = (x: number, y: number) => {
      target.x = clamp(x);
      target.y = clamp(y);
      if (visible && !frame) frame = requestAnimationFrame(tick);
    };

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      aim((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1);
    };

    // En Android llega sin pedir permiso; en iOS requiere permiso y no se pide.
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      aim(e.gamma / 25, (e.beta - 45) / 25);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(el);
    addEventListener("pointermove", onPointer, { passive: true });
    addEventListener("deviceorientation", onTilt, { passive: true });

    return () => {
      observer.disconnect();
      removeEventListener("pointermove", onPointer);
      removeEventListener("deviceorientation", onTilt);
      cancelAnimationFrame(frame);
    };
  }, [targetId]);

  return null;
}
