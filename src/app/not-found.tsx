import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";

// Vive fuera de los grupos, así que trae su propio header y footer.
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main
        id="contenido"
        className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center"
      >
        <p className="text-sm font-semibold text-primary">404</p>
        <h1 className="text-3xl font-bold tracking-tight">Esta página no existe</h1>
        <p className="text-muted">Puede que el link esté mal o que la página todavía esté en construcción.</p>
        <ButtonLink href="/" size="lg" className="mt-2">
          Volver al inicio
        </ButtonLink>
      </main>
      <SiteFooter />
    </>
  );
}
