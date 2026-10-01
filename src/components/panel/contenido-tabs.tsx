import Link from "next/link";

const TABS = [
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/ofertas", label: "Ofertas" },
  { href: "/admin/avisos", label: "Avisos" },
] as const;

/** Pestañas de la sección "Contenido" de administración. */
export function ContenidoTabs({ actual }: { actual: (typeof TABS)[number]["href"] }) {
  return (
    <nav aria-label="Contenido" className="mb-6 grid grid-cols-3 rounded-xl border border-border p-1 sm:inline-grid">
      {TABS.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          aria-current={t.href === actual ? "page" : undefined}
          className={`flex min-h-11 items-center justify-center rounded-lg px-5 text-base font-semibold ${
            t.href === actual ? "bg-primary text-on-primary" : "text-muted hover:text-foreground"
          }`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
