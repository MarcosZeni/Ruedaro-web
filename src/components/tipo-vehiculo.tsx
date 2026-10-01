import Link from "next/link";
import { IconBoat, IconCar, IconMoto, IconTruck } from "@/components/icons";
import { TIPOS } from "@/lib/catalogo";
import type { TipoVehiculo } from "@/lib/types";

const ICONOS = { auto: IconCar, moto: IconMoto, camion: IconTruck, lancha: IconBoat } as const;

export function TipoIcon({ tipo, className }: { tipo: TipoVehiculo; className?: string }) {
  const Icono = ICONOS[tipo];
  return <Icono className={className} />;
}

/**
 * Pestañas por tipo de vehículo ("Todos", "Autos y camionetas", "Motos"...).
 * Son links: cambiar de pestaña cambia la URL y borra los demás filtros, porque
 * las marcas de un tipo no sirven para otro.
 *
 * En celular bajan a otro renglón en vez de desplazarse de costado: una lista
 * que sigue fuera de la pantalla no se descubre, y la pestaña elegida podría
 * quedar escondida.
 */
export function TipoTabs({
  basePath,
  actual,
  cantidades,
}: {
  basePath: string;
  actual?: TipoVehiculo;
  cantidades?: Record<TipoVehiculo, number>;
}) {
  const opciones = [{ valor: undefined, label: "Todos" }, ...TIPOS];

  return (
    <nav aria-label="Tipo de vehículo" className="mb-4">
      <ul className="flex flex-wrap gap-2">
        {opciones.map((op) => {
          const activo = op.valor === actual;
          return (
            <li key={op.label}>
              <Link
                href={op.valor ? `${basePath}?tipo=${op.valor}` : basePath}
                aria-current={activo ? "page" : undefined}
                className={`flex min-h-11 items-center gap-2 rounded-full border px-4 text-base font-medium whitespace-nowrap ${
                  activo
                    ? "border-primary bg-primary text-on-primary"
                    : "border-border bg-background text-foreground hover:bg-surface"
                }`}
              >
                {op.valor && <TipoIcon tipo={op.valor} className="size-5" />}
                {op.label}
                {op.valor && cantidades && (
                  <span className={activo ? "opacity-80" : "text-muted"}>({cantidades[op.valor]})</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * Primer paso de los formularios de publicar: elegir el tipo con botones
 * grandes. Va antes que el resto porque cambia las marcas y si el uso se mide
 * en kilómetros o en horas.
 */
export function TipoPicker({ basePath, titulo }: { basePath: string; titulo: string }) {
  return (
    <section aria-labelledby="elegir-tipo">
      <h2 id="elegir-tipo" className="mb-4 text-lg font-semibold">
        {titulo}
      </h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {TIPOS.map((t) => (
          <li key={t.valor}>
            <Link
              href={`${basePath}?tipo=${t.valor}`}
              className="flex h-full min-h-32 flex-col items-center justify-center gap-3 rounded-xl border-2 border-border bg-background p-4 text-center hover:border-primary hover:bg-primary-soft"
            >
              <TipoIcon tipo={t.valor} className="size-10 text-primary" />
              <span className="text-base font-semibold">{t.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Etiqueta chica con ícono y nombre del tipo, para tarjetas. */
export function TipoChip({ tipo }: { tipo: TipoVehiculo }) {
  const info = TIPOS.find((t) => t.valor === tipo);
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-semibold tracking-wide text-primary uppercase">
      <TipoIcon tipo={tipo} className="size-4" />
      {info?.singular}
    </span>
  );
}
