import type { Metadata } from "next";
import Link from "next/link";
import { PageTitle } from "@/components/panel/page-title";
import { PrecioInput } from "@/components/precio-input";
import { TipoIcon, TipoPicker } from "@/components/tipo-vehiculo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { aniosDisponibles, infoTipo, MARCAS, parseTipo, ZONAS } from "@/lib/catalogo";
import { getCotizacion } from "@/lib/datos";
import { requireRol } from "@/lib/sesion";
import { ActionForm } from "@/components/action-form";
import { publicarAviso } from "@/lib/contenido-actions";

export const metadata: Metadata = { title: "Publicar aviso" };

const EJEMPLOS = {
  auto: { modelo: "Corolla", version: "2.0 XEI CVT" },
  moto: { modelo: "Wave 110", version: "S" },
  camion: { modelo: "Sprinter", version: "415 Furgón" },
  lancha: { modelo: "Open 21", version: "Evinrude 115 HP" },
} as const;

// Mismo esquema que publicar un pedido: primero el tipo, después el formulario.
export default async function NuevoAvisoPage({ searchParams }: PageProps<"/mis-avisos/nuevo">) {
  await requireRol("comprador", "revendedor");
  const tipo = parseTipo((await searchParams).tipo);

  if (!tipo) {
    return (
      <>
        <PageTitle back={{ href: "/mis-avisos", label: "Mis avisos" }} title="Publicar aviso" />
        <TipoPicker basePath="/mis-avisos/nuevo" titulo="¿Qué vas a publicar?" />
      </>
    );
  }

  const info = infoTipo(tipo);
  const ejemplo = EJEMPLOS[tipo];
  const cotizacion = await getCotizacion();
  const esLancha = tipo === "lancha";

  return (
    <>
      <PageTitle
        back={{ href: "/mis-avisos", label: "Mis avisos" }}
        title="Publicar aviso"
        description="Con buenas fotos y el precio claro, te escriben más."
      />

      <Card className="max-w-2xl">
        <div className="mb-6 flex items-center justify-between gap-3 rounded-lg bg-primary-soft px-4 py-3">
          <span className="flex items-center gap-2 text-base font-semibold text-primary">
            <TipoIcon tipo={tipo} className="size-6" />
            {info.label}
          </span>
          <Link href="/mis-avisos/nuevo" className="text-base font-medium text-primary underline">
            Cambiar
          </Link>
        </div>

        <ActionForm
          action={publicarAviso}
          className="flex flex-col gap-6"
          popups={{
            patente_existente: {
              titulo: esLancha ? "Esa matrícula ya está publicada" : "Esa patente ya está publicada",
              texto:
                "Ya tenemos un vehículo cargado con esa patente. Si es tuyo, lo encontrás en Mis avisos. " +
                "Si no lo publicaste vos, puede ser un intento de estafa con tu vehículo: escribinos y lo revisamos.",
              link: { href: "/mis-avisos", label: "Ver mis avisos" },
            },
          }}
        >
          <input type="hidden" name="tipo" value={tipo} />

          <div className="grid gap-4 sm:grid-cols-2">
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
            <Field label="Modelo" htmlFor="modelo">
              <Input id="modelo" name="modelo" required maxLength={80} placeholder={`Ej: ${ejemplo.modelo}`} autoComplete="off" />
            </Field>
          </div>

          <Field label="Versión" htmlFor="version" hint="Motor y equipamiento.">
            <Input
              id="version"
              name="version"
              required
              maxLength={80}
              placeholder={`Ej: ${ejemplo.version}`}
              autoComplete="off"
              aria-describedby="version-ayuda"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Año" htmlFor="anio">
              <Select id="anio" name="anio" required defaultValue="">
                <option value="" disabled>
                  Año
                </option>
                {aniosDisponibles().map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </Select>
            </Field>
            <Field label={info.uso.label} htmlFor="uso">
              <Input
                id="uso"
                name="uso"
                required
                inputMode="numeric"
                pattern="[0-9.]+"
                title={`Solo números, por ejemplo ${info.uso.ejemplo}`}
                placeholder={`Ej: ${info.uso.ejemplo}`}
                autoComplete="off"
              />
            </Field>
          </div>

          <PrecioInput name="precio" label="Precio" cotizacion={cotizacion} />

          <Field label="Zona" htmlFor="zona" hint="Dónde se puede ver el vehículo.">
            <Select id="zona" name="zona" required defaultValue="" aria-describedby="zona-ayuda">
              <option value="" disabled>
                Elegí la zona
              </option>
              {ZONAS.map((z) => (
                <option key={z}>{z}</option>
              ))}
            </Select>
          </Field>

          <Field
            label={esLancha ? "Matrícula" : "Patente"}
            htmlFor="patente"
            hint="No se muestra en el aviso. La usamos para que el mismo vehículo no se publique dos veces y para prevenir estafas."
          >
            <Input
              id="patente"
              name="patente"
              required
              maxLength={14}
              autoCapitalize="characters"
              autoComplete="off"
              placeholder={esLancha ? "Ej: REY12345" : tipo === "moto" ? "Ej: A123BCD" : "Ej: AB123CD"}
              aria-describedby="patente-ayuda"
              className="uppercase"
            />
          </Field>

          {/* Las fotos llegan en el próximo paso (subida, compresión y guardado). */}
          <p className="rounded-lg bg-surface px-4 py-3 text-base text-muted">
            <span className="font-medium text-foreground">Fotos:</span> muy pronto vas a poder subirlas.
          </p>

          <Field
            label="Descripción"
            htmlFor="descripcion"
            optional
            hint="Lo que haga la diferencia: único dueño, service al día, papeles, si toma usados."
          >
            <Textarea id="descripcion" name="descripcion" maxLength={1000} aria-describedby="descripcion-ayuda" />
          </Field>

          <Button type="submit" size="lg" className="w-full sm:w-auto sm:self-start">
            Publicar aviso
          </Button>
        </ActionForm>
      </Card>
    </>
  );
}
