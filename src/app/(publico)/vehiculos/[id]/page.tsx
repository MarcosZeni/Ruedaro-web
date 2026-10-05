import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconArrowLeft, IconChat } from "@/components/icons";
import { ConsejoCompra } from "@/components/consejo-compra";
import { TipoChip, TipoIcon } from "@/components/tipo-vehiculo";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { infoTipo } from "@/lib/catalogo";
import { getPublicacion } from "@/lib/datos";
import { formatEquivalente, formatPrecio, formatUso, haceCuanto, linkWhatsApp } from "@/lib/format";
import { SITE } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/vehiculos/[id]">): Promise<Metadata> {
  const p = await getPublicacion((await params).id);
  return { title: p ? `${p.marca} ${p.modelo} ${p.anio}` : "Vehículo" };
}

export default async function VehiculoPage({ params }: PageProps<"/vehiculos/[id]">) {
  const p = await getPublicacion((await params).id);
  if (!p) notFound();

  const info = infoTipo(p.tipo);
  const seccion = p.vendedor === "agencia" ? { href: "/vehiculos/agencias", label: "Agencias" } : { href: "/vehiculos/particulares", label: "Particulares" };
  const titulo = `${p.marca} ${p.modelo}`;
  const mensaje = `Hola ${p.revendedor.nombre}, vi en ${SITE.name} el ${titulo} ${p.anio} a ${formatPrecio(p.precio, p.moneda)}. ¿Sigue disponible?`;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href={`${seccion.href}?tipo=${p.tipo}`}
        className="-ml-1 mb-4 flex w-fit items-center gap-1 py-1 text-base font-medium text-muted hover:text-foreground"
      >
        <IconArrowLeft className="size-5" />
        {info.label} de {seccion.label.toLowerCase()}
      </Link>

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        {/* Lugar para la galería de fotos. */}
        <div className="flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-surface text-muted">
          <TipoIcon tipo={p.tipo} className="size-20" />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <TipoChip tipo={p.tipo} />
            <h1 className="mt-1 text-3xl font-bold tracking-tight">{titulo}</h1>
            <p className="text-lg text-muted">{p.version}</p>
          </div>

          <div>
            <p className="text-4xl font-bold">{formatPrecio(p.precio, p.moneda)}</p>
            {p.cotizacion && (
              <p className="mt-1 text-base text-muted">{formatEquivalente(p.precio, p.moneda, p.precioUsd, p.cotizacion)}</p>
            )}
          </div>

          <dl className="grid grid-cols-2 gap-2">
            <Dato label="Año" valor={String(p.anio)} />
            <Dato label={info.uso.label} valor={formatUso(p.uso, p.tipo)} />
            <Dato label="Zona" valor={p.zona} />
            <Dato label="Publicado" valor={haceCuanto(p.creado)} />
          </dl>

          {/* La acción principal, grande y en verde: es lo único que el comprador tiene que hacer. */}
          {p.revendedor.telefono && (
          <ButtonLink
            href={linkWhatsApp(p.revendedor.telefono, mensaje)}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="lg"
          >
            <IconChat className="size-5" />
            Consultar por WhatsApp
          </ButtonLink>
          )}

          <Card className="bg-surface">
            <p className="text-sm text-muted">Lo vende {p.vendedor === "agencia" ? "una agencia" : "un particular"}</p>
            <p className="text-lg font-semibold">{p.revendedor.nombre}</p>
            <p className="text-base text-muted">{p.zona}</p>
          </Card>

          <ConsejoCompra />
        </div>
      </div>

      {p.descripcion && (
        <section aria-labelledby="descripcion" className="mt-8 max-w-3xl">
          <h2 id="descripcion" className="mb-2 text-xl font-bold">
            Descripción
          </h2>
          <p className="text-base whitespace-pre-line">{p.descripcion}</p>
        </section>
      )}
    </div>
  );
}

function Dato({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="rounded-lg bg-surface px-3 py-2">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-base font-semibold">{valor}</dd>
    </div>
  );
}
