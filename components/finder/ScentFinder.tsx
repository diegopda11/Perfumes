"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { recommend, type FinderAnswers } from "@/lib/finder";
import type { Product } from "@/types/product";
import styles from "./ScentFinder.module.css";

type Key = keyof FinderAnswers;

const steps: {
  key: Key;
  legend: string;
  options: { value: string; label: string }[];
}[] = [
  {
    key: "para",
    legend: "¿Para quién es?",
    options: [
      { value: "ella", label: "Para ella" },
      { value: "el", label: "Para él" },
      { value: "cualquiera", label: "Me da igual" },
    ],
  },
  {
    key: "momento",
    legend: "¿Cuándo lo usarías?",
    options: [
      { value: "dia", label: "De día" },
      { value: "noche", label: "De noche" },
      { value: "siempre", label: "A toda hora" },
    ],
  },
  {
    key: "caracter",
    legend: "¿Qué te atrae más?",
    options: [
      { value: "fresco", label: "Fresco y limpio" },
      { value: "floral", label: "Floral y romántico" },
      { value: "calido", label: "Cálido y envolvente" },
      { value: "especiado", label: "Especiado y magnético" },
    ],
  },
];

/**
 * "Encuentra tu perfume" (spec 002, P7): tres preguntas y una recomendación
 * que lleva a la página del perfume. No abre WhatsApp (CA-4.4).
 */
export function ScentFinder({ products }: { products: Product[] }) {
  const [answers, setAnswers] = useState<FinderAnswers>({});
  const [step, setStep] = useState(0);
  const focusRef = useRef<HTMLElement>(null);
  const moved = useRef(false);

  // Al avanzar, el foco va a la nueva pregunta o al resultado.
  useEffect(() => {
    if (moved.current) focusRef.current?.focus({ preventScroll: true });
  }, [step]);

  const go = (next: number) => {
    moved.current = true;
    setStep(next);
  };

  const done = step >= steps.length;
  const results = done ? recommend(products, answers) : [];

  return (
    <div className="rounded-3xl border border-glass-edge bg-glass-fill p-6 backdrop-blur-xl md:p-10">
      {!done ? (
        <Question
          key={step}
          index={step}
          step={steps[step]}
          selected={answers[steps[step].key]}
          focusRef={focusRef}
          onPick={(value) => {
            setAnswers((a) => ({ ...a, [steps[step].key]: value }));
            go(step + 1);
          }}
          onBack={step > 0 ? () => go(step - 1) : undefined}
        />
      ) : (
        <div key="result" className={styles.reveal}>
          <h3
            ref={focusRef as React.RefObject<HTMLHeadingElement>}
            tabIndex={-1}
            className="text-sm text-text-muted outline-none"
          >
            {results.length > 0
              ? "Te recomendamos empezar por"
              : "No encontramos uno exacto"}
          </h3>

          {results.length > 0 ? (
            <>
              <Recommendation product={results[0]} />
              {results[1] && (
                <p className="mt-6 border-t border-glass-edge pt-5 text-text-muted">
                  También podría gustarte{" "}
                  <Link
                    href={`/producto/${results[1].slug}`}
                    className="text-text underline decoration-accent-lit/50 underline-offset-4 hover:decoration-accent-lit"
                  >
                    {results[1].name} de {results[1].brand}
                  </Link>
                  .
                </p>
              )}
            </>
          ) : (
            <p className="mt-3 text-text-muted">
              Mira la{" "}
              <Link
                href="/#catalogo"
                className="text-accent-lit underline underline-offset-4"
              >
                colección completa
              </Link>{" "}
              o prueba con otras respuestas.
            </p>
          )}

          <button
            type="button"
            onClick={() => {
              setAnswers({});
              go(0);
            }}
            className="mt-8 text-sm text-text-muted underline underline-offset-4 hover:text-text"
          >
            Empezar de nuevo
          </button>
        </div>
      )}
    </div>
  );
}

interface QuestionProps {
  index: number;
  step: (typeof steps)[number];
  selected?: string;
  focusRef: React.RefObject<HTMLElement | null>;
  onPick: (value: string) => void;
  onBack?: () => void;
}

function Question({
  index,
  step,
  selected,
  focusRef,
  onPick,
  onBack,
}: QuestionProps) {
  return (
    <div className={styles.reveal}>
      <div className="flex items-center justify-between gap-4">
        <Progress current={index} total={steps.length} />
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-text-muted hover:text-text"
          >
            Anterior
          </button>
        )}
      </div>
      <fieldset className="mt-6">
        <legend
          ref={focusRef as React.RefObject<HTMLLegendElement>}
          tabIndex={-1}
          className="font-display text-[30px] leading-tight outline-none md:text-[40px]"
        >
          {step.legend}
        </legend>
        <div className="mt-6 flex flex-wrap gap-3">
          {step.options.map((option) => {
            const id = `finder-${step.key}-${option.value}`;
            return (
              <label key={option.value} htmlFor={id} className={styles.option}>
                <input
                  id={id}
                  type="radio"
                  name={`finder-${step.key}`}
                  value={option.value}
                  defaultChecked={selected === option.value}
                  onChange={() => onPick(option.value)}
                  className="sr-only"
                />
                {option.label}
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}

/** Tres segmentos que se llenan como la fracción del decant. */
function Progress({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-3">
      <div aria-hidden className="flex gap-1.5">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`h-1 w-8 rounded-full transition-colors duration-300 ${
              i <= current ? "bg-accent-lit" : "bg-glass-edge"
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-text-muted">
        Pregunta {current + 1} de {total}
      </span>
    </div>
  );
}

function Recommendation({ product }: { product: Product }) {
  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group mt-4 grid grid-cols-[88px_1fr] items-center gap-5 md:grid-cols-[120px_1fr] md:gap-8"
    >
      <div className="relative aspect-[1/2] w-full">
        <Image
          src={product.images.bottle}
          alt=""
          fill
          sizes="120px"
          className="object-contain object-bottom transition-transform duration-500 ease-glide group-hover:-translate-y-1"
        />
      </div>
      <div>
        <p translate="no" className="text-sm text-text-muted">
          {product.brand}
        </p>
        <p
          translate="no"
          className="font-display text-[32px] leading-tight md:text-[44px]"
        >
          {product.name}
        </p>
        <p className="mt-2 max-w-[42ch] text-text-muted">{product.tagline}</p>
        <span className="mt-4 inline-block text-accent-lit underline decoration-accent-lit/40 underline-offset-4 group-hover:decoration-accent-lit">
          Ver perfume
        </span>
      </div>
    </Link>
  );
}
