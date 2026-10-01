import type { Metadata } from "next";
import { PageTitle } from "@/components/panel/page-title";
import { SuccessAlert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getMisOfertas } from "@/lib/demo-data";
import { formatPrecio, formatUso, haceCuanto } from "@/lib/format";
import { requireRol } from "@/lib/sesion";

export const metadata: Metadata = { title: "Mis ofertas" };

export default async function MisOfertasPage({ searchParams }: PageProps<"/mis-ofertas">) {
  await requireRol("revendedor");
  const { enviada } = await searchParams;
  const ofertas = await getMisOfertas();

  return (
    <>
      <PageTitle title="Mis ofertas" description="Las ofertas que mandaste y en qué quedó cada pedido." />

      {enviada === "1" && (
        <SuccessAlert title="¡Oferta enviada!">
          El comprador ya la puede ver. Si le interesa, te va a escribir por WhatsApp.
        </SuccessAlert>
      )}

      {ofertas.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border px-6 py-12 text-center">
          <p className="text-lg font-semibold">Todavía no hiciste ofertas</p>
          <p className="max-w-sm text-base text-muted">Mirá los pedidos de los compradores y ofertá donde tengas algo que les sirva.</p>
          <ButtonLink href="/pedidos" size="lg">
            Ver pedidos
          </ButtonLink>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {ofertas.map(({ oferta, pedido }) => (
            <li key={oferta.id}>
              <Card>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-muted">
                    Para el pedido <span className="font-medium text-foreground">{pedido.marca} {pedido.modelo}</span> ·{" "}
                    {pedido.zona}
                  </p>
                  {pedido.estado === "activo" ? <Badge tone="primary">Enviada</Badge> : <Badge>Pedido cerrado</Badge>}
                </div>

                <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
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

                <p className="mt-3 text-sm text-muted">Enviada {haceCuanto(oferta.creado)}</p>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
