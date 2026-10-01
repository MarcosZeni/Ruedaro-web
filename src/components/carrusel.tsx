"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

/**
 * Carrusel de tarjetas. Pensado para el celular primero:
 * - Se desliza con el dedo (scroll-snap nativo, sin librería).
 * - Avanza solo cada 5 segundos y vuelve al principio al llegar al final.
 * - Se frena mientras el usuario lo toca, lo apunta con el mouse o tiene el
 *   foco adentro: que no se le mueva lo que está mirando.
 * - Con "reducir movimiento" activado en el sistema, no avanza solo.
 * - Botones grandes de anterior/siguiente en pantallas con mouse.
 *
 * Qué tarjetas muestra lo decide el servidor (al azar en cada visita): este
 * componente solo las pasa.
 */
export function Carrusel({ titulo, children }: { titulo: string; children: ReactNode[] }) {
  const pista = useRef<HTMLUListElement>(null);
  const [pausado, setPausado] = useState(false);

  const mover = (direccion: 1 | -1) => moverPista(pista.current, direccion);

  useEffect(() => {
    if (pausado || children.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => moverPista(pista.current, 1), 5000);
    return () => window.clearInterval(timer);
  }, [pausado, children.length]);

  if (children.length === 0) return null;

  return (
    <section
      aria-roledescription="carrusel"
      aria-label={titulo}
      className="relative"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
      onTouchStart={() => setPausado(true)}
    >
      <ul
        ref={pista}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {children.map((hijo, i) => (
          <li
            key={i}
            aria-roledescription="diapositiva"
            aria-label={`${i + 1} de ${children.length}`}
            className="w-[75%] shrink-0 snap-start sm:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-3rem)/4)]"
          >
            {hijo}
          </li>
        ))}
      </ul>

      {children.length > 1 && (
        <div className="pointer-events-none absolute inset-y-0 -inset-x-3 hidden items-center justify-between md:flex">
          <BotonFlecha label="Anterior" onClick={() => mover(-1)}>
            ‹
          </BotonFlecha>
          <BotonFlecha label="Siguiente" onClick={() => mover(1)}>
            ›
          </BotonFlecha>
        </div>
      )}
    </section>
  );
}

/** Una tarjeta para un lado; al pasar la última, vuelve a la primera. */
function moverPista(el: HTMLUListElement | null, direccion: 1 | -1) {
  if (!el) return;
  const tarjeta = el.querySelector("li");
  const paso = (tarjeta?.getBoundingClientRect().width ?? el.clientWidth) + 16;
  const alFinal = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
  if (direccion === 1 && alFinal) el.scrollTo({ left: 0, behavior: "smooth" });
  else el.scrollBy({ left: paso * direccion, behavior: "smooth" });
}

function BotonFlecha({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="pointer-events-auto flex size-11 items-center justify-center rounded-full border border-border bg-background text-2xl leading-none text-foreground shadow-md hover:bg-surface"
    >
      {children}
    </button>
  );
}
