import type { Metadata } from "next";
import Link from "next/link";
import { PageTitle } from "@/components/panel/page-title";
import { PedidoDatos } from "@/components/pedido-datos";
import { Card } from "@/components/ui/card";
import { getResumenAdmin } from "@/lib/demo-data";
import { haceCuanto } from "@/lib/format";
import { requireRol } from "@/lib/sesion";

export const metadata: Metadata = { title: "Administración" };

export default async function AdminPage() {
  await requireRol("admin");
  const r = await getResumenAdmin();

  const tiles = [
    { label: "Compradores", valor: r.compradores, href: "/admin/usuarios" },
    { label: "Revendedores", valor: r.revendedores, href: "/admin/usuarios" },
    { label: "Pedidos activos", valor: r.pedidosActivos, href: "/admin/pedidos" },
    { label: "Ofertas", valor: r.ofertas, href: "/admin/ofertas" },
    { label: "Avisos publicados", valor: r.publicaciones, href: "/admin/avisos" },
  ];

  return (
    <>
      <PageTitle title="Resumen" description="Cómo viene la plataforma y qué hay para revisar." />

      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {tiles.map((t) => (
          <li key={t.label} className="last:col-span-2 lg:last:col-span-1">
            <Link href={t.href} className="block rounded-xl border border-border bg-background p-4 hover:shadow-md">
              <p className="text-base text-muted">{t.label}</p>
              <p className="mt-1 text-3xl font-bold tabular-nums">{t.valor}</p>
            </Link>
          </li>
        ))}
      </ul>

      {r.suspendidos > 0 && (
        <p className="mt-4 text-base text-muted">
          {r.suspendidos === 1 ? "Hay 1 usuario suspendido." : `Hay ${r.suspendidos} usuarios suspendidos.`}{" "}
          <Link href="/admin/usuarios" className="font-semibold text-primary">
            Ver usuarios
          </Link>
        </p>
      )}

      <section aria-labelledby="ultimos" className="mt-10">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 id="ultimos" className="text-lg font-semibold">
            Últimos pedidos
          </h2>
          <Link href="/admin/pedidos" className="text-base font-semibold text-primary">
            Ver todos →
          </Link>
        </div>
        <ul className="flex flex-col gap-3">
          {r.ultimosPedidos.map((p) => (
            <li key={p.id}>
              <Card>
                <p className="text-lg font-bold">
                  {p.marca} {p.modelo}
                </p>
                <p className="mb-3 text-sm text-muted">Publicado {haceCuanto(p.creado)}</p>
                <PedidoDatos pedido={p} />
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
