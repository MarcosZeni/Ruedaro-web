import Link from "next/link";
import { IconPlus, IconSearch } from "@/components/icons";
import { PublicacionCard } from "@/components/publicacion-card";
import { TipoIcon } from "@/components/tipo-vehiculo";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TIPOS } from "@/lib/catalogo";
import { getPublicaciones } from "@/lib/demo-data";
import { SITE } from "@/lib/site";

// Portada. Mobile-first: las clases sin prefijo son para el celular y
// sm:/md:/lg: agrandan para pantallas más anchas.

const PASOS = [
  {
    titulo: "Publicá tu pedido",
    texto: "Auto, moto, camión o lancha: marca, modelo, años, presupuesto y zona. Te lleva un minuto y es gratis.",
  },
  {
    titulo: "Recibí ofertas",
    texto: "Los revendedores te mandan vehículos que cumplen lo que pediste, con fotos, precio y datos.",
  },
  {
    titulo: "Elegí y hablá",
    texto: "Compará las ofertas y escribile por WhatsApp al que más te convenga.",
  },
];

const BENEFICIOS_REVENDEDOR = [
  {
    titulo: "Clientes que ya quieren comprar",
    texto: "Cada pedido es una persona buscando un vehículo concreto, con presupuesto y zona.",
  },
  {
    titulo: "Filtrá por lo que tenés",
    texto: "Mirá los pedidos por tipo, marca, zona y presupuesto, y ofertá solo donde lo que tenés encaja.",
  },
  {
    titulo: "Sin competir contra cientos",
    texto: "Cada pedido recibe un número limitado de ofertas, y cada revendedor oferta una sola vez.",
  },
];

type Modo = "buscar" | "publicar";

export default async function Home({ searchParams }: PageProps<"/">) {
  const modo: Modo = (await searchParams).modo === "publicar" ? "publicar" : "buscar";
  const recientes = modo === "buscar" ? (await getPublicaciones({})).slice(0, 4) : [];

  return (
    <>
      {/* Hero con dos pestañas: las dos formas de usar el sitio. */}
      <section className="bg-linear-to-b from-primary-soft to-background">
        <div className="mx-auto w-full max-w-6xl px-4 pt-6 pb-12 sm:px-6 md:pt-10 md:pb-20">
          <HeroTabs modo={modo} />
          {modo === "buscar" ? <HeroBuscar /> : <HeroPublicar />}
        </div>
      </section>

      {recientes.length > 0 && (
        <section aria-labelledby="recientes">
          <div className="mx-auto w-full max-w-6xl px-4 pb-4 sm:px-6">
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h2 id="recientes" className="text-2xl font-bold tracking-tight">
                Recién publicados
              </h2>
              <Link href="/vehiculos" className="text-base font-semibold text-primary">
                Ver todos →
              </Link>
            </div>
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {recientes.map((p) => (
                <li key={p.id}>
                  <PublicacionCard publicacion={p} href={`/vehiculos/${p.id}`} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Cómo funciona. scroll-mt deja lugar para el header fijo al saltar al ancla. */}
      <section id="como-funciona" className="scroll-mt-16">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <h2 className="text-3xl font-bold tracking-tight">Cómo funciona</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3 md:gap-6">
            {PASOS.map((paso, i) => (
              <li key={paso.titulo}>
                <Card className="h-full">
                  <span className="flex size-10 items-center justify-center rounded-full bg-primary-soft font-bold text-primary">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{paso.titulo}</h3>
                  <p className="mt-2 text-muted">{paso.texto}</p>
                </Card>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Revendedores */}
      <section id="revendedores" className="scroll-mt-16 bg-surface">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <h2 className="text-3xl font-bold tracking-tight">¿Sos revendedor?</h2>
          <p className="mt-3 max-w-2xl text-lg text-muted">
            Dejá de esperar que te escriban. Acá ves quién está buscando un vehículo y le ofertás directo. Y publicás lo que tenés para que lo encuentren.
          </p>
          <ul className="mt-8 grid gap-4 md:grid-cols-3 md:gap-6">
            {BENEFICIOS_REVENDEDOR.map((b) => (
              <li key={b.titulo}>
                <Card className="h-full">
                  <h3 className="text-lg font-semibold">{b.titulo}</h3>
                  <p className="mt-2 text-muted">{b.texto}</p>
                </Card>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <ButtonLink href="/registro?rol=revendedor" size="lg" className="w-full sm:w-auto">
              Quiero ver pedidos
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Cierre */}
      <section>
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 md:py-24">
          <h2 className="text-3xl font-bold tracking-tight text-balance">¿No encontrás lo que buscás?</h2>
          <p className="text-lg text-muted">Publicalo y dejá que las ofertas lleguen solas.</p>
          <ButtonLink href="/registro?rol=comprador" size="lg" className="w-full sm:w-auto">
            Publicar mi pedido
          </ButtonLink>
        </div>
      </section>
    </>
  );
}

/**
 * Pestañas "Buscar" y "Publicar pedido". Son links (?modo=publicar): funcionan
 * sin JavaScript y se pueden compartir. scroll={false} para que no salte arriba.
 */
function HeroTabs({ modo }: { modo: Modo }) {
  const tabs = [
    { modo: "buscar" as const, label: "Buscar", href: "/", icon: <IconSearch className="size-5 shrink-0" /> },
    { modo: "publicar" as const, label: "Publicar pedido", href: "/?modo=publicar", icon: <IconPlus className="size-5 shrink-0" /> },
  ];

  return (
    <nav aria-label="Qué querés hacer" className="mb-8 grid grid-cols-2 rounded-xl border border-border bg-background p-1 sm:inline-grid">
      {tabs.map((t) => (
        <Link
          key={t.modo}
          href={t.href}
          scroll={false}
          aria-current={modo === t.modo ? "page" : undefined}
          className={`flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 text-base font-semibold whitespace-nowrap ${
            modo === t.modo ? "bg-primary text-on-primary" : "text-muted hover:text-foreground"
          }`}
        >
          {t.icon}
          {t.label}
        </Link>
      ))}
    </nav>
  );
}

function HeroBuscar() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">¿Qué estás buscando?</h1>
        <p className="mt-3 text-lg text-muted text-pretty">
          Mirá lo que tienen hoy los revendedores. Si no está, publicá un pedido y te lo consiguen.
        </p>
      </div>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {TIPOS.map((t) => (
          <li key={t.valor}>
            <Link
              href={`/vehiculos?tipo=${t.valor}`}
              className="flex h-full min-h-32 flex-col items-center justify-center gap-3 rounded-xl border-2 border-border bg-background p-4 text-center hover:border-primary hover:bg-primary-soft"
            >
              <TipoIcon tipo={t.valor} className="size-10 text-primary" />
              <span className="text-base font-semibold">{t.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function HeroPublicar() {
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
      <div className="flex flex-col gap-6">
        <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">{SITE.tagline}</h1>
        <p className="text-lg text-muted text-pretty">
          En vez de pasarte horas buscando entre publicaciones, contá qué querés y cuánto querés gastar. Los
          revendedores que lo tienen te lo ofrecen.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/registro?rol=comprador" size="lg">
            Publicar mi pedido
          </ButtonLink>
          <ButtonLink href="/#revendedores" variant="secondary" size="lg">
            Soy revendedor
          </ButtonLink>
        </div>
        <p className="text-sm text-muted">Gratis para compradores.</p>
      </div>
      <EjemploPedido />
    </div>
  );
}

/** Maqueta de un pedido con ofertas: muestra la idea sin necesidad de explicarla. */
function EjemploPedido() {
  return (
    <div aria-hidden="true" className="mx-auto w-full max-w-md">
      <Card className="shadow-lg">
        <p className="text-xs font-semibold tracking-wide text-primary uppercase">Busco</p>
        <p className="mt-1 text-xl font-bold">Volkswagen Gol Trend</p>
        <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
          <Dato label="Años" valor="2016–2019" />
          <Dato label="Hasta" valor="USD 9.000" />
          <Dato label="Zona" valor="GBA Oeste" />
        </dl>
        <div className="mt-5 border-t border-border pt-4">
          <p className="text-sm font-semibold">3 ofertas recibidas</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <Oferta auto="Gol Trend 2018 · 62.000 km" precio="USD 8.700" />
            <Oferta auto="Gol Trend 2017 · 85.000 km" precio="USD 7.900" />
            <Oferta auto="Gol Trend 2019 · 40.000 km" precio="USD 9.000" />
          </ul>
        </div>
      </Card>
    </div>
  );
}

function Dato({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="rounded-lg bg-surface p-2">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="font-semibold">{valor}</dd>
    </div>
  );
}

function Oferta({ auto, precio }: { auto: string; precio: string }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2">
      <span className="text-muted">{auto}</span>
      <span className="font-semibold whitespace-nowrap">{precio}</span>
    </li>
  );
}
