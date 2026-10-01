import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconChat, IconExternal } from "@/components/icons";
import { TipoIcon } from "@/components/tipo-vehiculo";
import { PageTitle } from "@/components/panel/page-title";
import { PedidoDatos } from "@/components/pedido-datos";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MAX_OFERTAS_POR_PEDIDO } from "@/lib/catalogo";
import { getMiPedido, getOfertasDePedido } from "@/lib/demo-data";
import { formatPrecio, formatUso, haceCuanto, linkWhatsApp } from "@/lib/format";
import { SITE } from "@/lib/site";
import type { Oferta } from "@/lib/types";
import { CerrarPedido } from "./components/cerrar-pedido";
import { requireRol } from "@/lib/sesion";

export const metadata: Metadata = { title: "Ofertas de mi pedido" };

type Orden = "precio" | "recientes";

export default async function MiPedidoPage({ params, searchParams }: PageProps<"/mis-pedidos/[id]">) {
  await requireRol("comprador");
  const { id } = await params;
  const pedido = await getMiPedido(id);
  if (!pedido) notFound();

  const orden: Orden = (await searchParams).orden === "recientes" ? "recientes" : "precio";
  const ofertas = (await getOfertasDePedido(id)).sort((a, b) =>
    orden === "precio" ? a.precio - b.precio : b.creado.localeCompare(a.creado),
  );
  const activo = pedido.estado === "activo";

  return (
    <>
      <PageTitle
        back={{ href: "/mis-pedidos", label: "Mis pedidos" }}
        title={`${pedido.marca} ${pedido.modelo}`}
        description={`Publicado ${haceCuanto(pedido.creado)}`}
        action={<div>{activo ? <Badge tone="success">Activo</Badge> : <Badge>Cerrado</Badge>}</div>}
      />

      <Card className="mb-8">
        <PedidoDatos pedido={pedido} />
        {pedido.comentarios && (
          <p className="mt-4 text-base text-muted">
            <span className="font-medium text-foreground">Tus comentarios: </span>
            {pedido.comentarios}
          </p>
        )}
      </Card>

      <section aria-labelledby="ofertas">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="ofertas" className="text-xl font-bold">
            Ofertas recibidas{" "}
            <span className="font-normal text-muted">
              ({ofertas.length} de {MAX_OFERTAS_POR_PEDIDO})
            </span>
          </h2>
          {ofertas.length > 1 && <SelectorOrden id={id} orden={orden} />}
        </div>

        {ofertas.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border px-6 py-10 text-center">
            <p className="text-lg font-semibold">Todavía no recibiste ofertas</p>
            <p className="mt-2 text-base text-muted">
              Cuando un revendedor te haga una oferta, la vas a ver acá con fotos, precio y su WhatsApp.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {ofertas.map((o) => (
              <li key={o.id}>
                <OfertaCard oferta={o} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {activo && <CerrarPedido />}
    </>
  );
}

/** Dos opciones, como botones, en vez de un desplegable: se ve todo sin tocar nada. */
function SelectorOrden({ id, orden }: { id: string; orden: Orden }) {
  const opciones: { valor: Orden; label: string }[] = [
    { valor: "precio", label: "Más baratas" },
    { valor: "recientes", label: "Más nuevas" },
  ];

  return (
    <div role="group" aria-label="Ordenar ofertas" className="flex rounded-lg border border-border p-1">
      {opciones.map((op) => (
        <Link
          key={op.valor}
          href={`/mis-pedidos/${id}?orden=${op.valor}`}
          replace
          scroll={false}
          aria-current={orden === op.valor ? "true" : undefined}
          className={`flex min-h-10 flex-1 items-center justify-center rounded-md px-4 text-base font-medium whitespace-nowrap ${
            orden === op.valor ? "bg-primary text-on-primary" : "text-muted hover:text-foreground"
          }`}
        >
          {op.label}
        </Link>
      ))}
    </div>
  );
}

function OfertaCard({ oferta }: { oferta: Oferta }) {
  const auto = `${oferta.marca} ${oferta.modelo} ${oferta.anio}`;
  const mensaje =
    `Hola ${oferta.revendedor.nombre}, vi tu oferta en ${SITE.name} por el ${auto} ` +
    `a ${formatPrecio(oferta.precio, oferta.moneda)}. ¿Sigue disponible?`;

  return (
    <Card className="flex flex-col gap-4 sm:flex-row">
      {/* Lugar para la foto principal. Hasta que haya fotos, un ícono. */}
      <div className="flex aspect-[4/3] w-full shrink-0 items-center justify-center rounded-lg bg-surface text-muted sm:w-48">
        <TipoIcon tipo={oferta.tipo} className="size-12" />
      </div>

      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-lg font-bold">
              {oferta.marca} {oferta.modelo}
            </p>
            <p className="text-base text-muted">
              {oferta.version} · {oferta.anio} · {formatUso(oferta.uso, oferta.tipo)}
            </p>
          </div>
          <p className="text-2xl font-bold">{formatPrecio(oferta.precio, oferta.moneda)}</p>
        </div>

        {oferta.comentario && <p className="text-base">“{oferta.comentario}”</p>}

        <p className="text-sm text-muted">
          <span className="font-medium text-foreground">{oferta.revendedor.nombre}</span> ·{" "}
          {oferta.revendedor.zona} · ofertó {haceCuanto(oferta.creado)}
        </p>

        <div className="mt-auto flex flex-col gap-2 sm:flex-row">
          <ButtonLink
            href={linkWhatsApp(oferta.revendedor.telefono, mensaje)}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="lg"
          >
            <IconChat className="size-5" />
            Hablar por WhatsApp
          </ButtonLink>
          {oferta.link && (
            <ButtonLink href={oferta.link} target="_blank" rel="noopener noreferrer nofollow" variant="secondary" size="lg">
              Ver publicación
              <IconExternal className="size-5" />
            </ButtonLink>
          )}
        </div>
      </div>
    </Card>
  );
}
