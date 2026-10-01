import type { Metadata } from "next";
import { Moderar } from "@/components/panel/moderar";
import { ContenidoTabs } from "@/components/panel/contenido-tabs";
import { PageTitle } from "@/components/panel/page-title";
import { PedidoDatos } from "@/components/pedido-datos";
import { TipoChip } from "@/components/tipo-vehiculo";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getPedidosAdmin } from "@/lib/demo-data";
import { haceCuanto } from "@/lib/format";
import { requireRol } from "@/lib/sesion";

export const metadata: Metadata = { title: "Pedidos" };

export default async function AdminPedidosPage() {
  await requireRol("admin");
  const pedidos = await getPedidosAdmin();

  return (
    <>
      <PageTitle title="Contenido" description="Todos los pedidos, del más nuevo al más viejo." />
      <ContenidoTabs actual="/admin/pedidos" />

      <ul className="flex flex-col gap-3">
        {pedidos.map(({ pedido, autor }) => (
          <li key={pedido.id}>
            <Card className="flex flex-col gap-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <TipoChip tipo={pedido.tipo} />
                  <p className="text-lg font-bold">
                    {pedido.marca} {pedido.modelo}
                  </p>
                  <p className="text-sm text-muted">
                    De <span className="font-medium text-foreground">{autor}</span> · {haceCuanto(pedido.creado)} ·{" "}
                    {pedido.cantidadOfertas} ofertas
                  </p>
                </div>
                {pedido.estado === "cerrado" && <Badge>Cerrado por el comprador</Badge>}
              </div>
              <PedidoDatos pedido={pedido} />
              {pedido.comentarios && <p className="text-base text-muted">“{pedido.comentarios}”</p>}
              <Moderar tipo="pedido" nombre={`${pedido.marca} ${pedido.modelo}`} activoInicial />
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
