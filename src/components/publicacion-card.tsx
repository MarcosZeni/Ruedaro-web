import Link from "next/link";
import type { ReactNode } from "react";
import { TipoChip, TipoIcon } from "@/components/tipo-vehiculo";
import { formatPrecio, formatUso } from "@/lib/format";
import type { Publicacion } from "@/lib/types";

/**
 * Tarjeta de un vehículo del catálogo. Con `href`, toda la tarjeta es el link
 * (el blanco más grande para el dedo). `children` es para acciones abajo
 * (pausar, moderar), y en ese caso la tarjeta no es link: no se anidan
 * elementos interactivos.
 */
export function PublicacionCard({
  publicacion: p,
  href,
  children,
}: {
  publicacion: Publicacion;
  href?: string;
  children?: ReactNode;
}) {
  const contenido = (
    <>
      {/* Lugar para la foto principal. Hasta que haya fotos, el ícono del tipo. */}
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-lg bg-surface text-muted">
        <TipoIcon tipo={p.tipo} className="size-12" />
      </div>
      <div className="mt-3 flex flex-col gap-1">
        <TipoChip tipo={p.tipo} />
        <p className="text-lg leading-snug font-bold">
          {p.marca} {p.modelo}
        </p>
        <p className="text-base text-muted">
          {p.anio} · {formatUso(p.uso, p.tipo)}
        </p>
        <p className="mt-1 text-2xl font-bold">{formatPrecio(p.precio, p.moneda)}</p>
        <p className="text-sm text-muted">
          {p.revendedor.nombre} · {p.zona}
        </p>
      </div>
    </>
  );

  const clases = "flex h-full flex-col rounded-xl border border-border bg-background p-3 sm:p-4";

  if (href) {
    return (
      <Link href={href} className={`${clases} transition-shadow hover:shadow-md`}>
        {contenido}
      </Link>
    );
  }

  return (
    <div className={clases}>
      {contenido}
      {children && <div className="mt-4 border-t border-border pt-3">{children}</div>}
    </div>
  );
}
