"use client";

import Link from "next/link";
import { useRef } from "react";

interface Props {
  links: readonly { href: string; label: string }[];
}

/**
 * Menú de celular (CA-6.2). Usa <dialog> modal: atrapa el foco y se cierra
 * con Esc sin código extra.
 */
export function MobileMenu({ links }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="-mr-2 flex h-11 w-11 items-center justify-center md:hidden"
        aria-label="Abrir menú"
      >
        <span aria-hidden className="flex w-6 flex-col gap-[7px]">
          <span className="h-px w-full bg-text" />
          <span className="h-px w-2/3 self-end bg-text" />
        </span>
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Menú"
        className="m-0 h-dvh max-h-none w-screen max-w-none overscroll-contain bg-bg/95 p-0 text-text backdrop-blur-md backdrop:bg-transparent"
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="flex h-full flex-col px-4 py-4">
          <button
            type="button"
            onClick={close}
            className="-mr-2 flex h-11 w-11 items-center justify-center self-end text-2xl"
            aria-label="Cerrar menú"
          >
            <span aria-hidden>×</span>
          </button>
          <ul className="mt-10 flex flex-col gap-7 font-display text-4xl">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={close}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/#catalogo"
            onClick={close}
            className="mt-auto mb-6 inline-flex justify-center rounded-full border border-accent-lit/50 px-5 py-3.5 text-accent-lit"
          >
            Explorar colección
          </Link>
        </div>
      </dialog>
    </>
  );
}
