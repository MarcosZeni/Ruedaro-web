// Datos del sitio en un solo lugar (ver docs/nombres.md).
//
// El nombre es constante: es parte del producto y no cambia entre entornos.
// La URL sí cambia (localhost en desarrollo, ruedaro.com.ar en producción), por
// eso sale de la variable de entorno SITE_URL. Se usa para armar links
// absolutos: mails, vuelta del login con Google, vista previa al compartir.
// Solo del lado del servidor: ningún componente del navegador la necesita.
export const SITE = {
  name: "Ruedaro",
  url: (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/+$/, ""),
  tagline: "Decí qué auto buscás. Los revendedores te ofertan.",
} as const;
