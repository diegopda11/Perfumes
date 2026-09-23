import { site } from "@/config/site";

const steps = [
  {
    title: "Elige tu perfume",
    text: "Explora la colección y abre el que te llame. Ahí ves sus notas, el decant y el precio.",
  },
  {
    title: "Escríbenos por WhatsApp",
    text: "Desde la página del perfume, un toque abre el chat con el mensaje ya escrito.",
  },
  {
    title: "Recíbelo en persona",
    text: `Acordamos el pago y la entrega en ${site.locality.split(",")[0]}. Sin envíos ni intermediarios.`,
  },
];

/** "Cómo funciona" (CA-5.1): el proceso real, en tres pasos. */
export function HowItWorks() {
  return (
    <section aria-labelledby="como-funciona-title" className="border-t border-glass-edge">
      <div className="mx-auto max-w-[1440px] px-4 py-20 md:px-10 md:py-28">
        <h2 id="como-funciona-title" className="font-display text-[36px] leading-[1.05] md:text-[52px]">
          Cómo funciona
        </h2>
        <ol className="mt-10 grid gap-10 md:mt-14 md:grid-cols-3 md:gap-12">
          {steps.map((step, i) => (
            <li key={step.title} className="border-t border-glass-edge pt-6">
              <span aria-hidden className="font-display text-5xl leading-none text-accent-lit">
                {i + 1}
              </span>
              <h3 className="mt-5 text-xl">{step.title}</h3>
              <p className="mt-2 max-w-[38ch] leading-relaxed text-text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
