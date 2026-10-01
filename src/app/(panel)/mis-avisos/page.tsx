import type { Metadata } from "next";
import { PageTitle } from "@/components/panel/page-title";
import { PublicacionCard } from "@/components/publicacion-card";
import { SuccessAlert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { getMisPublicaciones } from "@/lib/demo-data";
import { requireRol } from "@/lib/sesion";
import { EstadoAviso } from "./components/estado-aviso";

export const metadata: Metadata = { title: "Mis avisos" };

export default async function MisAvisosPage({ searchParams }: PageProps<"/mis-avisos">) {
  await requireRol("revendedor");
  const { publicado } = await searchParams;
  const avisos = await getMisPublicaciones();

  return (
    <>
      <PageTitle
        title="Mis avisos"
        description="Los vehículos que tenés a la venta. Los compradores los ven en “Buscar”."
        action={
          <ButtonLink href="/mis-avisos/nuevo" size="lg" className="w-full sm:w-auto">
            Publicar aviso
          </ButtonLink>
        }
      />

      {publicado === "1" && (
        <SuccessAlert title="¡Listo! Publicamos tu aviso.">
          Ya aparece en el catálogo. Los interesados te van a escribir por WhatsApp.
        </SuccessAlert>
      )}

      {avisos.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border px-6 py-12 text-center">
          <p className="text-lg font-semibold">Todavía no publicaste nada</p>
          <p className="max-w-sm text-base text-muted">
            Cargá los vehículos que tenés para vender y aparecen en el catálogo para todos los compradores.
          </p>
          <ButtonLink href="/mis-avisos/nuevo" size="lg">
            Publicar mi primer aviso
          </ButtonLink>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {avisos.map((p) => (
            <li key={p.id}>
              <PublicacionCard publicacion={p}>
                <EstadoAviso inicial={p.estado} />
              </PublicacionCard>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
