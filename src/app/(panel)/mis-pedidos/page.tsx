import type { Metadata } from "next";
import Link from "next/link";
import { PageTitle } from "@/components/panel/page-title";
import { PedidoDatos } from "@/components/pedido-datos";
import { TipoChip } from "@/components/tipo-vehiculo";
import { SuccessAlert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { getMisPedidos } from "@/lib/datos";
import { haceCuanto } from "@/lib/format";
import type { Pedido } from "@/lib/types";
import { requireRol } from "@/lib/sesion";

export const metadata: Metadata = { title: "Mis pedidos" };

export default async function MisPedidosPage({ searchParams }: PageProps<"/mis-pedidos">) {
  await requireRol("comprador");
  const { publicado, cerrado } = await searchParams;
  const pedidos = await getMisPedidos();
  const activos = pedidos.filter((p) => p.estado === "activo");
  const cerrados = pedidos.filter((p) => p.estado === "cerrado");

  return (
    <>
      <PageTitle
        title="Mis pedidos"
        description="Lo que estás buscando y las ofertas que te mandaron."
        action={
          <ButtonLink href="/mis-pedidos/nuevo" size="lg" className="w-full sm:w-auto">
            Publicar pedido
          </ButtonLink>
        }
      />

      {publicado === "1" && (
        <SuccessAlert title="¡Listo! Publicamos tu pedido.">
          Los revendedores ya lo pueden ver. Las ofertas te van a aparecer acá.
        </SuccessAlert>
      )}

      {cerrado === "1" && (
        <SuccessAlert title="Cerramos tu pedido.">Los revendedores ya no lo ven. ¡Gracias por contarnos!</SuccessAlert>
      )}

      {pedidos.length === 0 ? (
        <SinPedidos />
      ) : (
        <div className="flex flex-col gap-10">
          <section aria-labelledby="activos">
            <h2 id="activos" className="mb-3 text-lg font-semibold">
              Buscando ahora ({activos.length})
            </h2>
            {activos.length === 0 ? (
              <p className="text-base text-muted">No tenés pedidos activos.</p>
            ) : (
              <ul className="flex flex-col gap-4">
                {activos.map((p) => (
                  <li key={p.id}>
                    <PedidoCard pedido={p} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          {cerrados.length > 0 && (
            <section aria-labelledby="cerrados">
              <h2 id="cerrados" className="mb-3 text-lg font-semibold text-muted">
                Cerrados ({cerrados.length})
              </h2>
              <ul className="flex flex-col gap-4">
                {cerrados.map((p) => (
                  <li key={p.id}>
                    <PedidoCard pedido={p} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </>
  );
}

/** Toda la tarjeta es el link: es el blanco más grande y el más obvio para tocar. */
function PedidoCard({ pedido }: { pedido: Pedido }) {
  const cerrado = pedido.estado === "cerrado";

  return (
    <Link
      href={`/mis-pedidos/${pedido.id}`}
      className={`block rounded-xl border border-border bg-background p-4 transition-shadow hover:shadow-md sm:p-5 ${
        cerrado ? "opacity-75" : ""
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <TipoChip tipo={pedido.tipo} />
          <p className="text-xl font-bold">
            {pedido.marca} {pedido.modelo}
          </p>
          <p className="text-sm text-muted">Publicado {haceCuanto(pedido.creado)}</p>
        </div>
        {cerrado ? <Badge>Cerrado</Badge> : <Badge tone="success">Activo</Badge>}
      </div>

      <PedidoDatos pedido={pedido} />

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
        {pedido.cantidadOfertas === 0 ? (
          <span className="text-base text-muted">Todavía no hay ofertas</span>
        ) : (
          <span className="text-base font-semibold">
            {pedido.cantidadOfertas} {pedido.cantidadOfertas === 1 ? "oferta" : "ofertas"}
          </span>
        )}
        <span className="text-base font-semibold text-primary">Ver detalle →</span>
      </div>
    </Link>
  );
}

function SinPedidos() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border px-6 py-12 text-center">
      <p className="text-lg font-semibold">Todavía no publicaste ningún pedido</p>
      <p className="max-w-sm text-base text-muted">
        Contanos qué auto buscás y cuánto querés gastar. Los revendedores te van a mandar ofertas.
      </p>
      <ButtonLink href="/mis-pedidos/nuevo" size="lg">
        Publicar mi primer pedido
      </ButtonLink>
    </div>
  );
}
