import type { Metadata } from "next";
import { Moderar } from "@/components/panel/moderar";
import { ContenidoTabs } from "@/components/panel/contenido-tabs";
import { PageTitle } from "@/components/panel/page-title";
import { Card } from "@/components/ui/card";
import { getOfertasAdmin } from "@/lib/datos";
import { formatPrecio, formatUso, haceCuanto } from "@/lib/format";
import { requireRol } from "@/lib/sesion";

export const metadata: Metadata = { title: "Ofertas" };

export default async function AdminOfertasPage() {
  await requireRol("admin");
  const ofertas = await getOfertasAdmin();

  return (
    <>
      <PageTitle title="Contenido" description="Todas las ofertas, de la más nueva a la más vieja." />
      <ContenidoTabs actual="/admin/ofertas" />

      <ul className="flex flex-col gap-3">
        {ofertas.map(({ oferta, pedido }) => (
          <li key={oferta.id}>
            <Card className="flex flex-col gap-3">
              <p className="text-sm text-muted">
                De <span className="font-medium text-foreground">{oferta.revendedor.nombre}</span> para el pedido{" "}
                <span className="font-medium text-foreground">
                  {pedido.marca} {pedido.modelo}
                </span>{" "}
                · {haceCuanto(oferta.creado)}
              </p>
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <p className="text-lg font-bold">
                    {oferta.marca} {oferta.modelo}
                  </p>
                  <p className="text-base text-muted">
                    {oferta.version} · {oferta.anio} · {formatUso(oferta.uso, oferta.tipo)}
                  </p>
                </div>
                <p className="text-xl font-bold">{formatPrecio(oferta.precio, oferta.moneda)}</p>
              </div>
              {oferta.comentario && <p className="text-base">“{oferta.comentario}”</p>}
              <Moderar tipo="oferta" id={oferta.id} nombre={`${oferta.marca} ${oferta.modelo} ${oferta.anio}`} activo={oferta.estado === "visible"} />
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
