import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageTitle } from "@/components/panel/page-title";
import { PedidoDatos } from "@/components/pedido-datos";
import { PrecioInput } from "@/components/precio-input";
import { TipoChip } from "@/components/tipo-vehiculo";
import { SuccessAlert } from "@/components/ui/alert";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { aniosDisponibles, infoTipo, MARCAS, MAX_OFERTAS_POR_PEDIDO } from "@/lib/catalogo";
import { getPedidoDisponible, getPedidosYaOfertados } from "@/lib/demo-data";
import { haceCuanto } from "@/lib/format";
import type { Pedido } from "@/lib/types";
import { enviarOferta } from "./actions";
import { requireRol } from "@/lib/sesion";

export const metadata: Metadata = { title: "Ofertar" };

export default async function PedidoPage({ params }: PageProps<"/pedidos/[id]">) {
  await requireRol("revendedor");
  const { id } = await params;
  const pedido = await getPedidoDisponible(id);
  if (!pedido) notFound();

  const yaOfertaste = (await getPedidosYaOfertados()).has(id);
  const lleno = pedido.cantidadOfertas >= MAX_OFERTAS_POR_PEDIDO;

  return (
    <>
      <PageTitle
        back={{ href: "/pedidos", label: "Pedidos" }}
        title={`Busca ${pedido.marca} ${pedido.modelo}`}
        description={`Publicado ${haceCuanto(pedido.creado)} · ${pedido.cantidadOfertas} de ${MAX_OFERTAS_POR_PEDIDO} ofertas`}
      />

      <Card className="mb-8">
        <div className="mb-3">
          <TipoChip tipo={pedido.tipo} />
        </div>
        <PedidoDatos pedido={pedido} />
        {pedido.comentarios && (
          <p className="mt-4 text-base">
            <span className="font-medium">Comentarios del comprador: </span>
            <span className="text-muted">{pedido.comentarios}</span>
          </p>
        )}
      </Card>

      {yaOfertaste ? (
        <SuccessAlert title="Ya ofertaste en este pedido">
          Se puede ofertar una sola vez por pedido. Si al comprador le interesa, te va a escribir por WhatsApp.
          <ButtonLink href="/mis-ofertas" variant="secondary" className="mt-3 flex w-full sm:w-auto">
            Ver mis ofertas
          </ButtonLink>
        </SuccessAlert>
      ) : lleno ? (
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-lg font-semibold">Este pedido ya recibió todas las ofertas posibles</p>
          <p className="mt-1 text-base text-muted">
            Para no llenar al comprador de mensajes, cada pedido recibe hasta {MAX_OFERTAS_POR_PEDIDO} ofertas.
          </p>
        </div>
      ) : (
        <OfertaForm pedido={pedido} />
      )}
    </>
  );
}

function OfertaForm({ pedido }: { pedido: Pedido }) {
  const anios = aniosDisponibles();
  const uso = infoTipo(pedido.tipo).uso;
  const ejemploVersion = { auto: "1.6 Highline", moto: "S", camion: "1.6 Furgón", lancha: "Mercury 90 HP" }[pedido.tipo];

  return (
    <section aria-labelledby="tu-oferta">
      <h2 id="tu-oferta" className="text-xl font-bold">
        Tu oferta
      </h2>
      <p className="mt-1 mb-4 text-base text-muted">
        Solo podés ofertar una vez en cada pedido: revisá los datos antes de enviar.
      </p>

      <Card className="max-w-2xl">
        <form action={enviarOferta} className="flex flex-col gap-6">
          <input type="hidden" name="pedidoId" value={pedido.id} />
          <input type="hidden" name="tipo" value={pedido.tipo} />

          {/* Vienen completos con lo que pidió el comprador; se cambian si se
              ofrece algo parecido (otro modelo que le puede servir). */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Marca" htmlFor="marca">
              <Select id="marca" name="marca" required defaultValue={pedido.marca}>
                {MARCAS[pedido.tipo].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </Select>
            </Field>
            <Field label="Modelo" htmlFor="modelo">
              <Input id="modelo" name="modelo" required maxLength={80} defaultValue={pedido.modelo} autoComplete="off" />
            </Field>
          </div>

          <Field label="Versión" htmlFor="version" hint="Motor y equipamiento, como figura en la publicación.">
            <Input
              id="version"
              name="version"
              required
              maxLength={80}
              placeholder={`Ej: ${ejemploVersion}`}
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
                {anios.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </Select>
            </Field>
            <Field label={uso.label} htmlFor="uso">
              <Input
                id="uso"
                name="uso"
                required
                inputMode="numeric"
                pattern="[0-9.]+"
                title={`Solo números, por ejemplo ${uso.ejemplo}`}
                placeholder={`Ej: ${uso.ejemplo}`}
                autoComplete="off"
              />
            </Field>
          </div>

          <PrecioInput name="precio" label="Precio" defaultMoneda={pedido.moneda} />

          <Field label="Fotos" htmlFor="fotos" hint="Hasta 10 fotos. La primera es la que se ve en la lista.">
            <input
              id="fotos"
              name="fotos"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              aria-describedby="fotos-ayuda"
              className="block w-full text-base text-muted file:mr-4 file:min-h-12 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary-soft file:px-4 file:font-semibold file:text-primary"
            />
          </Field>

          <Field
            label="Link a la publicación"
            htmlFor="link"
            optional
            hint="Si el auto está publicado en otro sitio (Mercado Libre, Instagram…)."
          >
            <Input id="link" name="link" type="url" placeholder="https://" aria-describedby="link-ayuda" />
          </Field>

          <Field
            label="Mensaje para el comprador"
            htmlFor="comentario"
            optional
            hint="Lo que haga la diferencia: único dueño, service al día, si tomás su auto como parte de pago."
          >
            <Textarea id="comentario" name="comentario" maxLength={500} aria-describedby="comentario-ayuda" />
          </Field>

          <Button type="submit" size="lg" className="w-full sm:w-auto sm:self-start">
            Enviar oferta
          </Button>
        </form>
      </Card>
    </section>
  );
}
