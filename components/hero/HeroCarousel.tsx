"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type CSSProperties } from "react";
import styles from "./HeroCarousel.module.css";

export interface HeroSlide {
  slug: string;
  name: string;
  brand: string;
  tagline: string;
  price: string;
  bottle: string;
  decant?: string;
}

const SWIPE_THRESHOLD = 50;

/** Posición de cada frasco respecto del activo: 0 centro, ±1 laterales, ±2 fuera. */
function slotOf(index: number, active: number, count: number): number {
  const diff = (index - active + count) % count;
  if (diff === 0) return 0;
  if (diff === 1) return 1;
  if (diff === count - 1) return -1;
  return diff <= count / 2 ? 2 : -2;
}

/**
 * Carrusel del hero (CA-1.2 a CA-1.9). Solo cambia por acción del
 * visitante: flechas, swipe o ←/→. Nunca avanza solo.
 */
export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  const pointerStart = useRef<number | null>(null);
  const swiped = useRef(false);

  const count = slides.length;
  const hasMany = count > 1;
  const current = slides[active];

  const go = (step: number) => setActive((i) => (i + step + count) % count);
  const prev = () => go(-1);
  const next = () => go(1);

  return (
    <div
      role="region"
      aria-roledescription="carrusel"
      aria-label="Perfumes destacados"
      className="absolute inset-0 z-10"
      onKeyDown={(e) => {
        if (!hasMany) return;
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
      }}
    >
      {/* Escenario: swipe cambia de perfume; un toque abre el detalle */}
      <div
        className="absolute inset-0"
        onPointerDown={(e) => {
          pointerStart.current = e.clientX;
          swiped.current = false;
        }}
        onPointerUp={(e) => {
          if (pointerStart.current === null || !hasMany) return;
          const dx = e.clientX - pointerStart.current;
          pointerStart.current = null;
          if (Math.abs(dx) < SWIPE_THRESHOLD) return;
          swiped.current = true;
          if (dx < 0) next();
          else prev();
        }}
        onClickCapture={(e) => {
          if (swiped.current) {
            e.preventDefault();
            e.stopPropagation();
            swiped.current = false;
          }
        }}
      >
        {slides.map((slide, i) => {
          const slot = slotOf(i, active, count);
          const isActive = slot === 0;
          return (
            <Link
              key={slide.slug}
              href={`/producto/${slide.slug}`}
              data-slot={slot}
              className={styles.bottle}
              style={{ "--slot": slot } as CSSProperties}
              tabIndex={isActive ? 0 : -1}
              aria-hidden={!isActive}
              aria-label={`Ver ${slide.name} de ${slide.brand}`}
              draggable={false}
            >
              <Image
                src={slide.bottle}
                alt=""
                fill
                sizes="(min-width: 768px) 320px, 240px"
                preload={i === 0}
                draggable={false}
                className="object-contain object-bottom select-none"
              />
            </Link>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {`${current.name} de ${current.brand}, ${active + 1} de ${count}`}
      </p>

      {/* Escritorio: tarjeta de vidrio con el decant (CA-1.4, CA-1.5) */}
      <Link
        key={`card-${current.slug}`}
        href={`/producto/${current.slug}`}
        className="absolute bottom-10 left-10 z-20 hidden w-[400px] items-center gap-6 rounded-2xl border border-glass-edge bg-glass-fill p-6 backdrop-blur-xl transition-colors hover:border-accent-lit/40 md:flex lg:left-14"
      >
        {current.decant && (
          <div className="relative flex shrink-0 flex-col items-center gap-2 border-r border-glass-edge pr-6">
            <Image
              src={current.decant}
              alt={`Decant de 10 ml de ${current.name}`}
              width={56}
              height={236}
              className={`${styles.reveal} h-[118px] w-auto`}
            />
            <span className="text-xs text-accent-lit">10 ml</span>
          </div>
        )}
        <div className={styles.reveal}>
          <p className="text-sm text-text-muted">{current.brand}</p>
          <h2 className="mt-1 font-display text-[30px] leading-[1.1]">{current.name}</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-text-muted">{current.tagline}</p>
          <p className="mt-4 text-xl text-accent-lit">
            {current.price}
            <span className="ml-2 text-sm text-text-muted">por decant de 10 ml</span>
          </p>
        </div>
      </Link>

      {/* Escritorio: flechas y posición */}
      {hasMany && (
        <div className="absolute right-10 bottom-12 z-20 hidden items-center gap-4 md:flex lg:right-14">
          <ArrowButton direction="prev" onClick={prev} />
          <span className="min-w-12 text-center text-sm tabular-nums text-text-muted">
            {active + 1} / {count}
          </span>
          <ArrowButton direction="next" onClick={next} />
        </div>
      )}

      {/* Celular: solo el nombre bajo el frasco (CA-1.9) */}
      <div className="absolute inset-x-4 bottom-[6svh] z-20 flex items-center justify-between gap-3 md:hidden">
        {hasMany ? <ArrowButton direction="prev" onClick={prev} /> : <span />}
        <Link
          key={`caption-${current.slug}`}
          href={`/producto/${current.slug}`}
          className={`${styles.reveal} min-w-0 text-center`}
        >
          <span className="block font-display text-[clamp(20px,6.4vw,26px)] leading-tight text-balance">
            {current.name}
          </span>
          <span className="block text-sm text-text-muted">{current.brand}</span>
        </Link>
        {hasMany ? <ArrowButton direction="next" onClick={next} /> : <span />}
      </div>
    </div>
  );
}

function ArrowButton({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Perfume anterior" : "Perfume siguiente"}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-glass-edge bg-glass-fill text-text backdrop-blur-md transition-colors hover:border-accent-lit/50 hover:text-accent-lit"
    >
      <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d={direction === "prev" ? "M10 3 5 8l5 5" : "M6 3l5 5-5 5"}
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
