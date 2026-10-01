import type { Metadata } from "next";
import Link from "next/link";
import { Moderar } from "@/components/panel/moderar";
import { PlanUsuario } from "@/components/panel/plan-usuario";
import { PageTitle } from "@/components/panel/page-title";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/field";
import { getUsuariosAdmin } from "@/lib/datos";
import { haceCuanto } from "@/lib/format";
import { requireRol } from "@/lib/sesion";
import type { Rol } from "@/lib/types";

export const metadata: Metadata = { title: "Usuarios" };

const ROL: Record<Rol, string> = { comprador: "Particular", revendedor: "Agencia", admin: "Admin" };

export default async function AdminUsuariosPage({ searchParams }: PageProps<"/admin/usuarios">) {
  await requireRol("admin");
  const q = (await searchParams).q;
  const busqueda = typeof q === "string" ? q.slice(0, 100) : "";
  const usuarios = await getUsuariosAdmin(busqueda);

  return (
    <>
      <PageTitle title="Usuarios" description="Buscá por nombre o email. Suspender a alguien oculta todo lo que publicó." />

      <form method="get" role="search" className="mb-6 flex flex-col gap-2 sm:flex-row">
        <label htmlFor="q" className="sr-only">
          Buscar usuario
        </label>
        <Input id="q" name="q" type="search" defaultValue={busqueda} placeholder="Nombre o email" className="sm:max-w-sm" />
        <Button type="submit" size="lg">
          Buscar
        </Button>
        {busqueda && (
          <Link href="/admin/usuarios" className="flex min-h-12 items-center justify-center px-4 text-base font-medium text-primary">
            Ver todos
          </Link>
        )}
      </form>

      <p className="mb-3 text-base text-muted">{usuarios.length === 1 ? "1 usuario" : `${usuarios.length} usuarios`}</p>

      <ul className="flex flex-col gap-3">
        {usuarios.map((u) => (
          <li key={u.id}>
            <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-lg font-semibold">{u.nombre}</p>
                  <Badge tone={u.rol === "revendedor" ? "primary" : "neutral"}>{ROL[u.rol]}</Badge>
                </div>
                <p className="truncate text-base text-muted">{u.email}</p>
                <p className="text-sm text-muted">Se registró {haceCuanto(u.creado)}</p>
              </div>
              {u.rol !== "admin" && (
                <div className="flex flex-col gap-3 sm:items-end">
                  <Moderar tipo="usuario" id={u.id} nombre={u.nombre} activo={u.estado === "activo"} />
                  <PlanUsuario id={u.id} planVence={u.planVence} />
                </div>
              )}
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
