// Solo servidor: la URL de la API es interna y nunca tiene que llegar al
// navegador. Importar esto desde un Client Component rompe el build.
import "server-only";

import { headers } from "next/headers";

// Red interna de Docker en producción (http://api:8080); loopback en desarrollo.
// Sin NEXT_PUBLIC_ a propósito: el navegador no sabe que la API existe.
const API_URL = process.env.API_URL ?? "http://127.0.0.1:5080";

/**
 * Llamada a la API .NET desde Server Components y Server Actions.
 *
 * La API ve la IP de ESTE servidor, no la del usuario, así que se la reenviamos
 * en X-Forwarded-For: sin eso el rate limit y la geolocalización cuentan a todos
 * como uno solo. La IP sale de X-Real-IP, que nginx escribe con la IP de la
 * conexión y pisando lo que mande el cliente; por eso se puede confiar en ella.
 * En desarrollo, sin nginx, no hay header y la API usa la IP de la conexión.
 */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const requestHeaders = new Headers(init.headers);

  const ip = (await headers()).get("x-real-ip");
  if (ip) requestHeaders.set("X-Forwarded-For", ip);

  return fetch(`${API_URL}${path}`, {
    ...init,
    headers: requestHeaders,
    // Datos de usuarios: nada de cache compartida entre pedidos.
    cache: "no-store",
  });
}
