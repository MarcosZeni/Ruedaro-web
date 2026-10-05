// Solo servidor: la URL de la API es interna y el token de sesión nunca tiene
// que llegar a un script del navegador. Importar esto desde un Client Component
// rompe el build.
import "server-only";

import { cookies, headers } from "next/headers";
import { unstable_rethrow } from "next/navigation";

// Red interna de Docker en producción (http://api:8080); loopback en desarrollo.
// Sin NEXT_PUBLIC_ a propósito: el navegador no sabe que la API existe.
const API_URL = process.env.API_URL ?? "http://127.0.0.1:5080";

/**
 * Cookie con el token de sesión. httpOnly: ningún script del navegador la
 * puede leer, así que un XSS no se la lleva. La lee este servidor y la manda a
 * la API en el header Authorization.
 */
export const COOKIE_SESION = "sesion";

/** Error de la API, con el código estable y el mensaje listo para mostrar. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly codigo: string,
    mensaje: string,
    readonly campo?: string,
  ) {
    super(mensaje);
  }
}

type ApiInit = RequestInit & {
  /** Token a mandar. Sin especificar, el de la cookie de sesión; null = ninguno. */
  token?: string | null;
};

/**
 * Llamada a la API .NET desde Server Components y Server Actions.
 *
 * La API ve la IP de ESTE servidor, no la del usuario, así que se la reenviamos
 * en X-Forwarded-For: sin eso el rate limit y la geolocalización cuentan a todos
 * como uno solo. La IP sale de X-Real-IP, que nginx escribe con la IP de la
 * conexión y pisando lo que mande el cliente; por eso se puede confiar en ella.
 * En desarrollo, sin nginx, no hay header y la API usa la IP de la conexión.
 */
export async function apiFetch(path: string, { token, ...init }: ApiInit = {}): Promise<Response> {
  const requestHeaders = new Headers(init.headers);

  const ip = (await headers()).get("x-real-ip");
  if (ip) requestHeaders.set("X-Forwarded-For", ip);

  const bearer = token === undefined ? (await cookies()).get(COOKIE_SESION)?.value : token;
  if (bearer) requestHeaders.set("Authorization", `Bearer ${bearer}`);

  if (init.body && !requestHeaders.has("Content-Type")) requestHeaders.set("Content-Type", "application/json");

  return fetch(`${API_URL}${path}`, {
    ...init,
    headers: requestHeaders,
    // Datos de usuarios: nada de cache compartida entre pedidos.
    cache: "no-store",
  });
}

/**
 * apiFetch + JSON. Si la API contesta con error, tira ApiError con su
 * mensaje; si no contesta, un ApiError "api_caida" con un mensaje para el
 * usuario (el detalle técnico va al log del servidor, no a la pantalla).
 */
export async function apiJson<T>(path: string, init: ApiInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await apiFetch(path, init);
  } catch (e) {
    // Adentro se leen cookies y headers: el aviso interno de Next de "página
    // dinámica" no es una caída de la API y tiene que seguir de largo.
    unstable_rethrow(e);
    console.error(`API no disponible (${path}):`, e);
    throw new ApiError(503, "api_caida", "No pudimos conectarnos. Probá de nuevo en un rato.");
  }

  if (res.ok) {
    // 204, o un 201 sin cuerpo (crear una oferta no devuelve nada): leer
    // JSON de una respuesta vacía tiraría error con la operación ya hecha.
    const cuerpo = await res.text();
    return (cuerpo ? JSON.parse(cuerpo) : undefined) as T;
  }

  const cuerpo = (await res.json().catch(() => null)) as { codigo?: string; mensaje?: string; campo?: string } | null;
  throw new ApiError(
    res.status,
    cuerpo?.codigo ?? "error",
    cuerpo?.mensaje ?? "Algo salió mal. Probá de nuevo.",
    cuerpo?.campo ?? undefined,
  );
}
