import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { SITE } from "@/lib/site";
import { dataTheme, getTema } from "@/lib/tema";
import "./globals.css";

// next/font descarga la fuente al compilar y la sirve desde el propio sitio: el
// navegador del usuario no le pide nada a Google.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: `${SITE.name} · ${SITE.tagline}`, template: `%s · ${SITE.name}` },
  description:
    "Publicá el auto que buscás con tu presupuesto y recibí ofertas de revendedores. Gratis para compradores.",
};

// Explícito aunque Next lo ponga por defecto: la web se usa sobre todo desde el
// celular y este es el renglón que lo hace posible.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Color de la barra del navegador en el celular, según el tema del sistema.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // El tema elegido llega en una cookie: la página sale del servidor ya pintada.
  const tema = await getTema();

  return (
    // data-scroll-behavior: el scroll suave (scroll-smooth) es para los links a
    // secciones de la misma página; al cambiar de página Next lo apaga, para que
    // no se vea la página nueva deslizándose hasta arriba.
    <html
      lang="es-AR"
      data-theme={dataTheme(tema)}
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-on-primary"
        >
          Saltar al contenido
        </a>
        {/* Header, main y footer los pone cada grupo: (publico) o (panel). */}
        {children}
      </body>
    </html>
  );
}
