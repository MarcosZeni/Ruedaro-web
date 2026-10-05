import "server-only";

import { unstable_rethrow } from "next/navigation";
import { ApiError, apiJson } from "@/lib/api";
import type { Cotizacion, MisPublicaciones, Oferta, Pedido, Publicacion, TipoVehiculo, Usuario, Vendedor } from "@/lib/types";

// =============================================================================
// Lecturas de la API para las páginas. Las escrituras están en Server Actions
// junto a cada formulario.
// =============================================================================

/** Un id que viene de la URL: solo dígitos, o ni se le pregunta a la API. */
export function idValido(id: string): boolean {
  return /^\d{1,19}$/.test(id);
}

/** GET que devuelve null si la API contesta 404 (no existe, no es tuyo o ya no está). */
async function oNull<T>(path: string): Promise<T | null> {
  try {
    return await apiJson<T>(path);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

export type Filtros = {
  tipo?: TipoVehiculo;
  marca?: string;
  zona?: string;
  hasta?: number;
  anioDesde?: number;
  vendedor?: Vendedor;
};

function query(f: Filtros, extra: Record<string, string> = {}): string {
  const q = new URLSearchParams(extra);
  if (f.tipo) q.set("tipo", f.tipo);
  if (f.marca) q.set("marca", f.marca);
  if (f.zona) q.set("zona", f.zona);
  if (f.hasta) q.set("hasta", String(f.hasta));
  if (f.anioDesde) q.set("desde", String(f.anioDesde));
  if (f.vendedor) q.set("vendedor", f.vendedor);
  const s = q.toString();
  return s ? `?${s}` : "";
}

/**
 * Lecturas públicas que no deben tirar la página si la API está caída:
 * devuelven el valor vacío y avisan con `caida` para mostrar un mensaje.
 */
export async function conRespaldo<T>(lectura: Promise<T>, vacio: T): Promise<{ datos: T; caida: boolean }> {
  try {
    return { datos: await lectura, caida: false };
  } catch (e) {
    unstable_rethrow(e); // los errores internos de Next siguen de largo
    console.error("La API no contestó; se muestra la página sin esos datos.", e);
    return { datos: vacio, caida: true };
  }
}

// ---- Comprador ---------------------------------------------------------------

export const getMisPedidos = () => apiJson<Pedido[]>("/api/v1/mis-pedidos");

export const getMiPedido = (id: string) =>
  idValido(id) ? oNull<{ pedido: Pedido; ofertas: Oferta[] }>(`/api/v1/mis-pedidos/${id}`) : Promise.resolve(null);

// ---- Revendedor --------------------------------------------------------------

export const getPedidosDisponibles = (f: Filtros) => apiJson<Pedido[]>(`/api/v1/pedidos${query(f)}`);

export const getPedidoDisponible = (id: string) =>
  idValido(id) ? oNull<Pedido>(`/api/v1/pedidos/${id}`) : Promise.resolve(null);

export const getMisOfertas = () => apiJson<{ oferta: Oferta; pedido: Pedido }[]>("/api/v1/mis-ofertas");

export const getMisPublicaciones = () => apiJson<MisPublicaciones>("/api/v1/mis-publicaciones");

// ---- Catálogo público ----------------------------------------------------------

// Sin sesión (token: null): el catálogo es igual para todos.
export const getPublicaciones = (f: Filtros, limite?: number) =>
  apiJson<Publicacion[]>(`/api/v1/publicaciones${query(f, limite ? { limite: String(limite) } : {})}`, { token: null });

export const getPublicacion = async (id: string) => {
  if (!idValido(id)) return null;
  try {
    return await apiJson<Publicacion>(`/api/v1/publicaciones/${id}`, { token: null });
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
};

export const getCantidadPorTipo = (vendedor?: Vendedor) =>
  apiJson<Record<TipoVehiculo, number>>(`/api/v1/publicaciones/cantidades${vendedor ? `?vendedor=${vendedor}` : ""}`, { token: null });

/** Hasta 10 al azar: destacados de esa sección y, si faltan, otros avisos. */
export const getCarrusel = (vendedor: Vendedor) =>
  apiJson<Publicacion[]>(`/api/v1/publicaciones/carrusel?vendedor=${vendedor}`, { token: null });

/**
 * Dólar oficial (BCRA) para la conversión en vivo de los formularios. Si no
 * hay, null: el formulario funciona igual, sin mostrar el equivalente.
 */
export async function getCotizacion(): Promise<Cotizacion | null> {
  try {
    return await apiJson<Cotizacion>("/api/v1/cotizacion", { token: null });
  } catch (e) {
    unstable_rethrow(e);
    return null;
  }
}

// ---- Administración ------------------------------------------------------------

export type ResumenAdmin = {
  compradores: number;
  revendedores: number;
  suspendidos: number;
  pedidosActivos: number;
  ofertas: number;
  publicaciones: number;
  ultimosPedidos: Pedido[];
};

export const getResumenAdmin = () => apiJson<ResumenAdmin>("/api/v1/admin/resumen");

export const getUsuariosAdmin = (busqueda?: string) =>
  apiJson<Usuario[]>(`/api/v1/admin/usuarios${busqueda ? `?q=${encodeURIComponent(busqueda)}` : ""}`);

export const getPedidosAdmin = () => apiJson<{ pedido: Pedido; autor: string }[]>("/api/v1/admin/pedidos");

export const getOfertasAdmin = () => apiJson<{ oferta: Oferta; pedido: Pedido }[]>("/api/v1/admin/ofertas");

export const getPublicacionesAdmin = () => apiJson<Publicacion[]>("/api/v1/admin/publicaciones");
