import type { Metadata } from "next";
import Link from "next/link";
import { IconFilter } from "@/components/icons";
import { PageTitle } from "@/components/panel/page-title";
import { PedidoDatos } from "@/components/pedido-datos";
import { TipoChip, TipoTabs } from "@/components/tipo-vehiculo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Select } from "@/components/ui/field";
import { MARCAS, MAX_OFERTAS_POR_PEDIDO, parseMarca, parseTipo, RANGOS_PRECIO_USD, ZONAS } from "@/lib/catalogo";
import { type Filtros, getPedidosDisponibles } from "@/lib/datos";
import { formatPrecio, haceCuanto } from "@/lib/format";
import type { Pedido } from "@/lib/types";
import { requireRol } from "@/lib/sesion";

export const metadata: Metadata = { title: "Pedidos de compradores" };

/**
 * Los filtros vienen de la URL y se aceptan solo si están en el catálogo: lo
 * que no se reconoce se ignora, no se pasa tal cual a la consulta.
 */
function leerFiltros(sp: Record<string, string | string[] | undefined>): Filtros {
  const uno = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);
  const tipo = parseTipo(uno(sp.tipo));
  const zona = uno(sp.zona);
  const hasta = Number(uno(sp.hasta));

  return {
    tipo,
    marca: parseMarca(tipo, uno(sp.marca)),
    zona: ZONAS.find((z) => z === zona),
    hasta: RANGOS_PRECIO_USD.find((r) => r === hasta),
  };
}

export default async function PedidosPage({ searchParams }: PageProps<"/pedidos">) {
  await requireRol("revendedor");
  const filtros = leerFiltros(await searchParams);
  const pedidos = await getPedidosDisponibles(filtros);
  // El tipo no cuenta como filtro: es la pestaña.
  const cantidadFiltros = [filtros.marca, filtros.zona, filtros.hasta].filter(Boolean).length;
  const hayFiltros = cantidadFiltros > 0;

  return (
    <>
      <PageTitle
        title="Pedidos de compradores"
        description="Gente buscando un vehículo ahora. Ofertá en los que tengas algo que les sirva."
      />

      <TipoTabs basePath="/pedidos" actual={filtros.tipo} />

      {/* Plegados, para que en el celular lo primero que se vea sean los pedidos
          y no tres desplegables. Abiertos si hay filtros puestos, así se ve qué
          está filtrando. <details> no necesita JavaScript.
          GET: los filtros quedan en la URL, así se pueden guardar o compartir. */}
      <details open={hayFiltros} className="group mb-6 rounded-xl border border-border bg-surface">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-base font-semibold [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-2">
            <IconFilter className="size-5" />
            Filtrar pedidos
            {cantidadFiltros > 0 && (
              <span className="rounded-full bg-primary px-2 text-sm text-on-primary">{cantidadFiltros}</span>
            )}
          </span>
          <span aria-hidden="true" className="text-muted transition-transform group-open:rotate-180">
            ▾
          </span>
        </summary>
        <form method="get" className="border-t border-border p-4">
          {/* El tipo viaja escondido: los filtros se aplican dentro de la pestaña elegida. */}
          {filtros.tipo && <input type="hidden" name="tipo" value={filtros.tipo} />}
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Sin tipo elegido no hay lista de marcas que tenga sentido: primero la pestaña. */}
            {filtros.tipo && (
              <Field label="Marca" htmlFor="f-marca">
                <Select id="f-marca" name="marca" defaultValue={filtros.marca ?? ""}>
                  <option value="">Todas</option>
                  {MARCAS[filtros.tipo].map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </Select>
              </Field>
            )}
            <Field label="Zona" htmlFor="f-zona">
              <Select id="f-zona" name="zona" defaultValue={filtros.zona ?? ""}>
                <option value="">Todas</option>
                {ZONAS.map((z) => (
                  <option key={z}>{z}</option>
                ))}
              </Select>
            </Field>
            <Field label="Presupuesto hasta" htmlFor="f-hasta">
              <Select id="f-hasta" name="hasta" defaultValue={filtros.hasta?.toString() ?? ""}>
                <option value="">Cualquiera</option>
                {RANGOS_PRECIO_USD.map((r) => (
                  <option key={r} value={r}>
                    {formatPrecio(r, "USD")}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button type="submit" size="lg">
              Buscar
            </Button>
            {hayFiltros && (
              <Link href={filtros.tipo ? `/pedidos?tipo=${filtros.tipo}` : "/pedidos"} className="flex min-h-12 items-center justify-center px-4 text-base font-medium text-primary">
                Borrar filtros
              </Link>
            )}
          </div>
        </form>
      </details>

      <p className="mb-3 text-base text-muted" aria-live="polite">
        {pedidos.length === 1 ? "1 pedido" : `${pedidos.length} pedidos`}
        {hayFiltros ? " con estos filtros" : ""}
      </p>

      {pedidos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-10 text-center">
          <p className="text-lg font-semibold">No hay pedidos con estos filtros</p>
          <p className="mt-2 text-base text-muted">Probá con otra zona o sacá algún filtro.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {pedidos.map((p) => (
            <li key={p.id}>
              <PedidoCard pedido={p} yaOfertaste={p.yaOferte === true} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function PedidoCard({ pedido, yaOfertaste }: { pedido: Pedido; yaOfertaste: boolean }) {
  const lleno = pedido.cantidadOfertas >= MAX_OFERTAS_POR_PEDIDO;

  return (
    <Link
      href={`/pedidos/${pedido.id}`}
      className="block rounded-xl border border-border bg-background p-4 transition-shadow hover:shadow-md sm:p-5"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <TipoChip tipo={pedido.tipo} />
          <p className="text-xl font-bold">
            {pedido.marca} {pedido.modelo}
          </p>
        </div>
        {yaOfertaste ? (
          <Badge tone="success">Ya ofertaste</Badge>
        ) : lleno ? (
          <Badge>Cupo completo</Badge>
        ) : null}
      </div>

      <PedidoDatos pedido={pedido} />

      {pedido.comentarios && <p className="mt-3 line-clamp-2 text-base text-muted">“{pedido.comentarios}”</p>}

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
        <span className="text-sm text-muted">
          {haceCuanto(pedido.creado)} · {pedido.cantidadOfertas} de {MAX_OFERTAS_POR_PEDIDO} ofertas
        </span>
        {!yaOfertaste && !lleno && <span className="text-base font-semibold text-primary">Ofertar →</span>}
      </div>
    </Link>
  );
}
