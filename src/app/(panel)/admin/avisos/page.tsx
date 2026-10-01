import type { Metadata } from "next";
import { ContenidoTabs } from "@/components/panel/contenido-tabs";
import { Moderar } from "@/components/panel/moderar";
import { PageTitle } from "@/components/panel/page-title";
import { PublicacionCard } from "@/components/publicacion-card";
import { getPublicacionesAdmin } from "@/lib/demo-data";
import { requireRol } from "@/lib/sesion";

export const metadata: Metadata = { title: "Avisos" };

export default async function AdminAvisosPage() {
  await requireRol("admin");
  const avisos = await getPublicacionesAdmin();

  return (
    <>
      <PageTitle title="Contenido" description="Todos los avisos del catálogo, del más nuevo al más viejo." />
      <ContenidoTabs actual="/admin/avisos" />

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {avisos.map((p) => (
          <li key={p.id}>
            <PublicacionCard publicacion={p}>
              <Moderar tipo="aviso" nombre={`${p.marca} ${p.modelo} ${p.anio}`} activoInicial={p.estado === "activa"} />
            </PublicacionCard>
          </li>
        ))}
      </ul>
    </>
  );
}
