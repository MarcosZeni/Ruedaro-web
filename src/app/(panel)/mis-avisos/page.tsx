import type { Metadata } from "next";
import { PageTitle } from "@/components/panel/page-title";
import { PublicacionCard } from "@/components/publicacion-card";
import { SuccessAlert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { getMisPublicaciones } from "@/lib/datos";
import { requireRol } from "@/lib/sesion";
import { DestacarAviso } from "./components/destacar-aviso";
import { EstadoAviso } from "./components/estado-aviso";

export const metadata: Metadata = { title: "Mis avisos" };

export default async function MisAvisosPage({ searchParams }: PageProps<"/mis-avisos">) {
  const usuario = await requireRol("comprador", "revendedor");
  const { publicado } = await searchParams;
  const { avisos, destacadosUsados, destacadosMax, planVence } = await getMisPublicaciones();
  const sinLugar = destacadosUsados >= destacadosMax;
  const seccion = usuario.rol === "revendedor" ? "Agencias" : "Particulares";

  return (
    <>
      <PageTitle
        title="Mis avisos"
        description={`Los vehículos que tenés a la venta. Se ven en “Buscar”, en la sección ${seccion}.`}
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

      {/* Los destacados son lo que se paga: que se entienda cuántos hay y cómo tener más. */}
      <div className="mb-6 rounded-xl border border-border bg-surface p-4">
        <p className="text-base">
          <span className="font-semibold">
            Destacados: {destacadosUsados} de {destacadosMax}
          </span>{" "}
          <span className="text-muted">· salen en el carrusel de la portada</span>
        </p>
        <p className="mt-1 text-sm text-muted">
          {planVence
            ? `Tenés el plan de ${destacadosMax} destacados hasta el ${new Date(planVence).toLocaleDateString("es-AR")}.`
            : "Tenés 1 destacado gratis. Con el plan de destacados podés tener hasta 10: escribinos para activarlo."}
        </p>
      </div>

      {avisos.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border px-6 py-12 text-center">
          <p className="text-lg font-semibold">Todavía no publicaste nada</p>
          <p className="max-w-sm text-base text-muted">
            Cargá lo que tenés para vender y aparece en el catálogo para todos los compradores.
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
                <div className="flex flex-col gap-3">
                  {p.patente && (
                    <p className="text-sm text-muted">
                      {p.tipo === "lancha" ? "Matrícula" : "Patente"}:{" "}
                      <span className="font-mono font-semibold text-foreground">{p.patente}</span> (no se muestra)
                    </p>
                  )}
                  {(p.estado === "activa" || p.estado === "pausada") && (
                    <DestacarAviso id={p.id} destacada={p.destacada} sinLugar={sinLugar} />
                  )}
                  <EstadoAviso id={p.id} estado={p.estado} />
                </div>
              </PublicacionCard>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
