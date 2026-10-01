import Link from "next/link";
import { Carrusel } from "@/components/carrusel";
import { IconFilter } from "@/components/icons";
import { PublicacionCard } from "@/components/publicacion-card";
import { TipoTabs } from "@/components/tipo-vehiculo";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, Select } from "@/components/ui/field";
import { aniosDisponibles, infoTipo, MARCAS, parseMarca, parseTipo, RANGOS_PRECIO_USD, ZONAS } from "@/lib/catalogo";
import { type Filtros, getCantidadPorTipo, getCarrusel, getPublicaciones } from "@/lib/datos";
import type { Vendedor } from "@/lib/types";
import { formatPrecio } from "@/lib/format";

/**
 * Los filtros vienen de la URL y se aceptan solo si están en el catálogo: lo
 * que no se reconoce se ignora, no se pasa tal cual a la consulta.
 */
function leerFiltros(sp: Record<string, string | string[] | undefined>): Filtros {
  const uno = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);
  const tipo = parseTipo(uno(sp.tipo));
  const hasta = Number(uno(sp.hasta));
  const anioDesde = Number(uno(sp.desde));

  return {
    tipo,
    marca: parseMarca(tipo, uno(sp.marca)),
    zona: ZONAS.find((z) => z === uno(sp.zona)),
    hasta: RANGOS_PRECIO_USD.find((r) => r === hasta),
    anioDesde: aniosDisponibles().find((a) => a === anioDesde),
  };
}

const SECCIONES = [
  { vendedor: "agencia", href: "/vehiculos/agencias", label: "Agencias", texto: "Vehículos de agencias y revendedores." },
  { vendedor: "particular", href: "/vehiculos/particulares", label: "Particulares", texto: "Vehículos que venden sus dueños." },
] as const;

/**
 * Catálogo de una sección (agencias o particulares): pestañas de sección,
 * carrusel de destacados, pestañas por tipo, filtros y listado. Las dos
 * páginas son esto mismo con distinto vendedor.
 */
export async function Catalogo({
  vendedor,
  searchParams,
}: {
  vendedor: Vendedor;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const seccion = SECCIONES.find((s) => s.vendedor === vendedor)!;
  const basePath = seccion.href;
  const filtros: Filtros = { ...leerFiltros(searchParams), vendedor };
  const [publicaciones, cantidades, carrusel] = await Promise.all([
    getPublicaciones(filtros),
    getCantidadPorTipo(vendedor),
    // El carrusel solo en la vista general: con filtros puestos, el usuario
    // está buscando algo puntual y le estorbaría arriba de los resultados.
    filtros.tipo || filtros.marca || filtros.zona || filtros.hasta || filtros.anioDesde ? [] : getCarrusel(vendedor),
  ]);
  const cantidadFiltros = [filtros.marca, filtros.zona, filtros.hasta, filtros.anioDesde].filter(Boolean).length;
  const titulo = filtros.tipo ? infoTipo(filtros.tipo).label : "Todos los vehículos";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      {/* Dos secciones separadas, como pestañas grandes: se entiende de un vistazo
          si se está mirando lo de agencias o lo de particulares. */}
      <nav aria-label="Sección" className="mb-6 grid grid-cols-2 rounded-xl border border-border bg-surface p-1 sm:inline-grid">
        {SECCIONES.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            aria-current={s.vendedor === vendedor ? "page" : undefined}
            className={`flex min-h-12 items-center justify-center rounded-lg px-6 text-base font-semibold ${
              s.vendedor === vendedor ? "bg-primary text-on-primary" : "text-muted hover:text-foreground"
            }`}
          >
            {s.label}
          </Link>
        ))}
      </nav>

      {carrusel.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-3 text-xl font-bold">Destacados de {seccion.label.toLowerCase()}</h2>
          <Carrusel titulo={`Destacados de ${seccion.label.toLowerCase()}`}>
            {carrusel.map((p) => (
              <PublicacionCard key={p.id} publicacion={p} href={`/vehiculos/${p.id}`} />
            ))}
          </Carrusel>
        </div>
      )}

      <h1 className="text-3xl font-bold tracking-tight">{titulo}</h1>
      <p className="mt-1 mb-6 text-base text-muted">{seccion.texto}</p>

      <TipoTabs basePath={basePath} actual={filtros.tipo} cantidades={cantidades} />

      <details open={cantidadFiltros > 0} className="group mb-6 rounded-xl border border-border bg-surface">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-base font-semibold [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-2">
            <IconFilter className="size-5" />
            Más filtros
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            <Field label="Precio hasta" htmlFor="f-hasta">
              <Select id="f-hasta" name="hasta" defaultValue={filtros.hasta?.toString() ?? ""}>
                <option value="">Cualquiera</option>
                {RANGOS_PRECIO_USD.map((r) => (
                  <option key={r} value={r}>
                    {formatPrecio(r, "USD")}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Año desde" htmlFor="f-desde">
              <Select id="f-desde" name="desde" defaultValue={filtros.anioDesde?.toString() ?? ""}>
                <option value="">Cualquiera</option>
                {aniosDisponibles().map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button type="submit" size="lg">
              Buscar
            </Button>
            {cantidadFiltros > 0 && (
              <Link
                href={filtros.tipo ? `${basePath}?tipo=${filtros.tipo}` : basePath}
                className="flex min-h-12 items-center justify-center px-4 text-base font-medium text-primary"
              >
                Borrar filtros
              </Link>
            )}
          </div>
        </form>
      </details>

      <p className="mb-3 text-base text-muted" aria-live="polite">
        {publicaciones.length === 1 ? "1 vehículo" : `${publicaciones.length} vehículos`}
      </p>

      {publicaciones.length === 0 ? (
        <SinResultados tipo={filtros.tipo ? infoTipo(filtros.tipo).singular : "vehículo"} />
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {publicaciones.map((p) => (
            <li key={p.id}>
              <PublicacionCard publicacion={p} href={`/vehiculos/${p.id}`} />
            </li>
          ))}
        </ul>
      )}

      <PedidoCta />
    </div>
  );
}

/** Si no está, que lo pida: es justamente lo que diferencia al sitio. */
function SinResultados({ tipo }: { tipo: string }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border px-6 py-12 text-center">
      <p className="text-lg font-semibold">No encontramos lo que buscás</p>
      <p className="max-w-md text-base text-muted">
        Publicá un pedido con el {tipo} que querés y tu presupuesto, y los revendedores te lo consiguen.
      </p>
      <ButtonLink href="/registro?rol=comprador" size="lg">
        Publicar pedido
      </ButtonLink>
    </div>
  );
}

function PedidoCta() {
  return (
    <div className="mt-10 flex flex-col items-start gap-3 rounded-xl bg-primary-soft p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-lg font-semibold">¿No ves lo que buscás?</p>
        <p className="text-base text-muted">Publicá un pedido y los revendedores te mandan ofertas.</p>
      </div>
      <ButtonLink href="/registro?rol=comprador" size="lg" className="w-full sm:w-auto">
        Publicar pedido
      </ButtonLink>
    </div>
  );
}
