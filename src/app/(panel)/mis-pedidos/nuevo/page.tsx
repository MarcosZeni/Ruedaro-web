import type { Metadata } from "next";
import Link from "next/link";
import { PageTitle } from "@/components/panel/page-title";
import { PrecioInput } from "@/components/precio-input";
import { TipoIcon, TipoPicker } from "@/components/tipo-vehiculo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { aniosDisponibles, infoTipo, MARCAS, parseTipo, ZONAS } from "@/lib/catalogo";
import { requireRol } from "@/lib/sesion";
import { publicarPedido } from "./actions";

export const metadata: Metadata = { title: "Publicar pedido" };

const EJEMPLO_MODELO = { auto: "Gol Trend", moto: "Wave 110", camion: "Kangoo", lancha: "Classic 18" } as const;

// Dos pasos: primero qué tipo de vehículo (botones grandes), después un solo
// formulario corto, de arriba hacia abajo, en el orden en que la gente lo
// piensa: qué, de qué años, cuánto quiero gastar, dónde estoy.
export default async function NuevoPedidoPage({ searchParams }: PageProps<"/mis-pedidos/nuevo">) {
  await requireRol("comprador");
  const tipo = parseTipo((await searchParams).tipo);

  if (!tipo) {
    return (
      <>
        <PageTitle
          back={{ href: "/mis-pedidos", label: "Mis pedidos" }}
          title="Publicar pedido"
          description="Contanos qué buscás y los revendedores te van a mandar ofertas."
        />
        <TipoPicker basePath="/mis-pedidos/nuevo" titulo="¿Qué estás buscando?" />
      </>
    );
  }

  const info = infoTipo(tipo);
  const anios = aniosDisponibles();

  return (
    <>
      <PageTitle
        back={{ href: "/mis-pedidos", label: "Mis pedidos" }}
        title={`¿Qué ${info.singular} buscás?`}
        description="Completá estos datos y los revendedores te van a mandar ofertas."
      />

      <Card className="max-w-2xl">
        {/* El tipo elegido, a la vista y con salida para cambiarlo. */}
        <div className="mb-6 flex items-center justify-between gap-3 rounded-lg bg-primary-soft px-4 py-3">
          <span className="flex items-center gap-2 text-base font-semibold text-primary">
            <TipoIcon tipo={tipo} className="size-6" />
            {info.label}
          </span>
          <Link href="/mis-pedidos/nuevo" className="text-base font-medium text-primary underline">
            Cambiar
          </Link>
        </div>

        <form action={publicarPedido} className="flex flex-col gap-6">
          <input type="hidden" name="tipo" value={tipo} />

          <Field label="Marca" htmlFor="marca">
            <Select id="marca" name="marca" required defaultValue="">
              <option value="" disabled>
                Elegí una marca
              </option>
              {MARCAS[tipo].map((m) => (
                <option key={m}>{m}</option>
              ))}
            </Select>
          </Field>

          <Field label="Modelo" htmlFor="modelo" hint="Si te sirven varios, ponelos todos.">
            <Input
              id="modelo"
              name="modelo"
              required
              maxLength={80}
              placeholder={`Ej: ${EJEMPLO_MODELO[tipo]}`}
              autoComplete="off"
              aria-describedby="modelo-ayuda"
            />
          </Field>

          <fieldset>
            <legend className="mb-1.5 text-base font-medium">Años</legend>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Desde" htmlFor="anioDesde">
                <Select id="anioDesde" name="anioDesde" required defaultValue="">
                  <option value="" disabled>
                    Año
                  </option>
                  {anios.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Hasta" htmlFor="anioHasta">
                <Select id="anioHasta" name="anioHasta" required defaultValue="">
                  <option value="" disabled>
                    Año
                  </option>
                  {anios.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </Select>
              </Field>
            </div>
          </fieldset>

          <PrecioInput
            name="presupuesto"
            label="¿Cuánto querés gastar como máximo?"
            hint="Es un tope: te pueden ofertar más barato."
          />

          <Field label="¿Dónde estás?" htmlFor="zona" hint="Así te ofertan revendedores cerca tuyo.">
            <Select id="zona" name="zona" required defaultValue="" aria-describedby="zona-ayuda">
              <option value="" disabled>
                Elegí tu zona
              </option>
              {ZONAS.map((z) => (
                <option key={z}>{z}</option>
              ))}
            </Select>
          </Field>

          <Field
            label="Comentarios"
            htmlFor="comentarios"
            optional
            hint="Por ejemplo: si tenés algo para entregar como parte de pago, color, si lo querés con GNC o con trailer."
          >
            <Textarea id="comentarios" name="comentarios" maxLength={500} aria-describedby="comentarios-ayuda" />
          </Field>

          <Button type="submit" size="lg" className="w-full sm:w-auto sm:self-start">
            Publicar pedido
          </Button>
        </form>
      </Card>
    </>
  );
}
