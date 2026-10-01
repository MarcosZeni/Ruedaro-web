import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

// Páginas públicas: portada, cómo funciona y, más adelante, registro e ingreso.
export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader />
      <main id="contenido" className="flex flex-1 flex-col">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
