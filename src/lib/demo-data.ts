import type { Oferta, Pedido, Publicacion, Revendedor, TipoVehiculo, Usuario } from "@/lib/types";

// =============================================================================
// DATOS DE EJEMPLO
//
// Solo para ver la web funcionando antes de que existan los endpoints. Cada
// función tiene la misma forma que va a tener la llamada a la API: el día que
// esté el endpoint, se reemplaza el cuerpo por un apiFetch y las páginas no
// cambian. Cuando no quede ninguna, se borra este archivo.
// =============================================================================

const hace = (horas: number) => new Date(Date.now() - horas * 3_600_000).toISOString();

const MORON: Revendedor = { nombre: "Autos Morón", zona: "GBA Oeste", telefono: "5491100000001" };
const CASTELAR: Revendedor = { nombre: "Castelar Motors", zona: "GBA Oeste", telefono: "5491100000002" };
const RAMOS: Revendedor = { nombre: "Ramos Autos", zona: "GBA Oeste", telefono: "5491100000003" };
const MI_AGENCIA: Revendedor = { nombre: "Mi agencia", zona: "GBA Norte", telefono: "5491100000009" };
const MOTOS_SUR: Revendedor = { nombre: "Motos del Sur", zona: "GBA Sur", telefono: "5491100000004" };
const NAUTICA: Revendedor = { nombre: "Náutica Tigre", zona: "GBA Norte", telefono: "5491100000005" };
const UTILITARIOS: Revendedor = { nombre: "Utilitarios Córdoba", zona: "Córdoba", telefono: "5493510000006" };

/** Pedidos de todos los compradores. Los tres primeros son "del usuario actual". */
const PEDIDOS: Pedido[] = [
  {
    id: "p1", tipo: "auto", marca: "Volkswagen", modelo: "Gol Trend", anioDesde: 2016, anioHasta: 2019,
    presupuesto: 9_000, moneda: "USD", zona: "GBA Oeste", estado: "activo", creado: hace(26),
    comentarios: "Preferentemente nafta, con service al día. Puedo entregar un Clio 2010.",
    cantidadOfertas: 3,
  },
  {
    id: "p2", tipo: "moto", marca: "Honda", modelo: "Wave 110", anioDesde: 2021, anioHasta: 2024,
    presupuesto: 1_800, moneda: "USD", zona: "CABA", estado: "activo", creado: hace(5),
    comentarios: "Para hacer delivery.", cantidadOfertas: 0,
  },
  {
    id: "p3", tipo: "auto", marca: "Fiat", modelo: "Cronos", anioDesde: 2019, anioHasta: 2022,
    presupuesto: 14_000, moneda: "USD", zona: "GBA Oeste", estado: "cerrado", creado: hace(24 * 20),
    cantidadOfertas: 6,
  },
  {
    id: "p4", tipo: "auto", marca: "Chevrolet", modelo: "Onix", anioDesde: 2017, anioHasta: 2020,
    presupuesto: 11_000, moneda: "USD", zona: "GBA Norte", estado: "activo", creado: hace(2),
    comentarios: "Que no sea de remís.", cantidadOfertas: 1,
  },
  {
    id: "p5", tipo: "camion", marca: "Renault", modelo: "Kangoo", anioDesde: 2015, anioHasta: 2020,
    presupuesto: 9_500, moneda: "USD", zona: "Córdoba", estado: "activo", creado: hace(9),
    comentarios: "Versión furgón, para reparto.", cantidadOfertas: 4,
  },
  {
    id: "p6", tipo: "auto", marca: "Peugeot", modelo: "208", anioDesde: 2020, anioHasta: 2023,
    presupuesto: 17_000, moneda: "USD", zona: "CABA", estado: "activo", creado: hace(30),
    cantidadOfertas: 10,
  },
  {
    id: "p7", tipo: "lancha", marca: "Bermuda", modelo: "Classic 18", anioDesde: 2005, anioHasta: 2015,
    presupuesto: 15_000, moneda: "USD", zona: "GBA Norte", estado: "activo", creado: hace(50),
    comentarios: "Con motor fuera de borda y trailer.", cantidadOfertas: 2,
  },
  {
    id: "p8", tipo: "moto", marca: "Yamaha", modelo: "FZ 25", anioDesde: 2019, anioHasta: 2023,
    presupuesto: 4_500, moneda: "USD", zona: "GBA Sur", estado: "activo", creado: hace(14),
    cantidadOfertas: 1,
  },
];

const MIS_PEDIDOS = ["p1", "p2", "p3"];

const OFERTAS: Oferta[] = [
  {
    id: "o1", pedidoId: "p1", tipo: "auto", marca: "Volkswagen", modelo: "Gol Trend", version: "1.6 Trendline",
    anio: 2018, uso: 62_000, precio: 8_700, moneda: "USD", creado: hace(20),
    comentario: "Único dueño, service oficial. Acepto tu Clio como parte de pago.",
    link: "https://example.com/gol-trend-2018", revendedor: MORON,
  },
  {
    id: "o2", pedidoId: "p1", tipo: "auto", marca: "Volkswagen", modelo: "Gol Trend", version: "1.6 Comfortline",
    anio: 2017, uso: 85_000, precio: 7_900, moneda: "USD", creado: hace(12), revendedor: CASTELAR,
  },
  {
    id: "o3", pedidoId: "p1", tipo: "auto", marca: "Volkswagen", modelo: "Gol Trend", version: "1.6 Highline",
    anio: 2019, uso: 40_000, precio: 9_000, moneda: "USD", creado: hace(3),
    comentario: "Con cubiertas nuevas y VTV al día.", revendedor: RAMOS,
  },
  // Del revendedor actual, en pedidos de otros.
  {
    id: "o4", pedidoId: "p4", tipo: "auto", marca: "Chevrolet", modelo: "Onix", version: "1.4 LT",
    anio: 2019, uso: 55_000, precio: 10_500, moneda: "USD", creado: hace(1), revendedor: MI_AGENCIA,
  },
  {
    id: "o5", pedidoId: "p6", tipo: "auto", marca: "Peugeot", modelo: "208", version: "1.6 Allure",
    anio: 2021, uso: 30_000, precio: 16_800, moneda: "USD", creado: hace(28), revendedor: MI_AGENCIA,
  },
  {
    id: "o6", pedidoId: "p7", tipo: "lancha", marca: "Bermuda", modelo: "Classic 18", version: "Mercury 90 HP",
    anio: 2011, uso: 420, precio: 14_000, moneda: "USD", creado: hace(40),
    comentario: "Con trailer y lona. Guardada bajo techo.", revendedor: NAUTICA,
  },
];

const MIS_OFERTAS = ["o4", "o5"];

/** Catálogo: lo que los revendedores tienen para vender. */
const PUBLICACIONES: Publicacion[] = [
  {
    id: "v1", tipo: "auto", marca: "Toyota", modelo: "Corolla", version: "2.0 XEI CVT", anio: 2020, uso: 48_000,
    precio: 21_500, moneda: "USD", zona: "GBA Oeste", estado: "activa", creado: hace(6), revendedor: MORON,
    descripcion: "Único dueño, service oficial, cubiertas nuevas.",
  },
  {
    id: "v2", tipo: "auto", marca: "Volkswagen", modelo: "Amarok", version: "2.0 Highline 4x4", anio: 2018, uso: 110_000,
    precio: 26_000, moneda: "USD", zona: "GBA Norte", estado: "activa", creado: hace(30), revendedor: MI_AGENCIA,
    descripcion: "Caja automática, cuero, enganche.",
  },
  {
    id: "v3", tipo: "auto", marca: "Fiat", modelo: "Cronos", version: "1.3 Drive", anio: 2022, uso: 25_000,
    precio: 14_200, moneda: "USD", zona: "GBA Oeste", estado: "activa", creado: hace(50), revendedor: CASTELAR,
  },
  {
    id: "v4", tipo: "moto", marca: "Honda", modelo: "Wave 110", version: "S", anio: 2023, uso: 4_000,
    precio: 1_700, moneda: "USD", zona: "GBA Sur", estado: "activa", creado: hace(3), revendedor: MOTOS_SUR,
    descripcion: "Como nueva, con casco de regalo.",
  },
  {
    id: "v5", tipo: "moto", marca: "Yamaha", modelo: "FZ 25", version: "ABS", anio: 2021, uso: 18_000,
    precio: 4_300, moneda: "USD", zona: "GBA Sur", estado: "activa", creado: hace(20), revendedor: MOTOS_SUR,
  },
  {
    id: "v6", tipo: "camion", marca: "Mercedes-Benz", modelo: "Sprinter", version: "415 Furgón", anio: 2017, uso: 190_000,
    precio: 24_000, moneda: "USD", zona: "Córdoba", estado: "activa", creado: hace(70), revendedor: UTILITARIOS,
  },
  {
    id: "v7", tipo: "camion", marca: "Renault", modelo: "Kangoo", version: "1.6 Furgón", anio: 2019, uso: 95_000,
    precio: 9_800, moneda: "USD", zona: "Córdoba", estado: "activa", creado: hace(12), revendedor: UTILITARIOS,
    descripcion: "Lista para trabajar. Papeles al día.",
  },
  {
    id: "v8", tipo: "lancha", marca: "Regnicoli", modelo: "Open 21", version: "Evinrude 115 HP", anio: 2012, uso: 380,
    precio: 19_000, moneda: "USD", zona: "GBA Norte", estado: "activa", creado: hace(100), revendedor: NAUTICA,
    descripcion: "Con trailer. Amarra en Tigre.",
  },
  {
    id: "v9", tipo: "auto", marca: "Chevrolet", modelo: "Onix", version: "1.4 LT", anio: 2019, uso: 55_000,
    precio: 10_500, moneda: "USD", zona: "GBA Norte", estado: "pausada", creado: hace(200), revendedor: MI_AGENCIA,
  },
];

/** Publicaciones del revendedor actual ("Mi agencia"). */
const MIS_PUBLICACIONES = ["v2", "v9"];

// ---- Comprador ---------------------------------------------------------------

export async function getMisPedidos(): Promise<Pedido[]> {
  return PEDIDOS.filter((p) => MIS_PEDIDOS.includes(p.id));
}

export async function getMiPedido(id: string): Promise<Pedido | null> {
  return MIS_PEDIDOS.includes(id) ? (PEDIDOS.find((p) => p.id === id) ?? null) : null;
}

export async function getOfertasDePedido(pedidoId: string): Promise<Oferta[]> {
  return OFERTAS.filter((o) => o.pedidoId === pedidoId);
}

// ---- Revendedor --------------------------------------------------------------

export type FiltrosPedidos = { tipo?: TipoVehiculo; marca?: string; zona?: string; hasta?: number };

export async function getPedidosDisponibles(filtros: FiltrosPedidos): Promise<Pedido[]> {
  return PEDIDOS.filter(
    (p) =>
      !MIS_PEDIDOS.includes(p.id) &&
      p.estado === "activo" &&
      (!filtros.tipo || p.tipo === filtros.tipo) &&
      (!filtros.marca || p.marca === filtros.marca) &&
      (!filtros.zona || p.zona === filtros.zona) &&
      (!filtros.hasta || p.presupuesto <= filtros.hasta),
  ).sort((a, b) => b.creado.localeCompare(a.creado));
}

export async function getPedidoDisponible(id: string): Promise<Pedido | null> {
  return (await getPedidosDisponibles({})).find((p) => p.id === id) ?? null;
}

export async function getMisOfertas(): Promise<{ oferta: Oferta; pedido: Pedido }[]> {
  return OFERTAS.filter((o) => MIS_OFERTAS.includes(o.id)).flatMap((oferta) => {
    const pedido = PEDIDOS.find((p) => p.id === oferta.pedidoId);
    return pedido ? [{ oferta, pedido }] : [];
  });
}

/** IDs de pedidos en los que el revendedor actual ya ofertó (oferta una sola vez por pedido). */
export async function getPedidosYaOfertados(): Promise<Set<string>> {
  return new Set(OFERTAS.filter((o) => MIS_OFERTAS.includes(o.id)).map((o) => o.pedidoId));
}

export async function getMisPublicaciones(): Promise<Publicacion[]> {
  return PUBLICACIONES.filter((p) => MIS_PUBLICACIONES.includes(p.id));
}

// ---- Catálogo público ----------------------------------------------------------

export type FiltrosCatalogo = {
  tipo?: TipoVehiculo;
  marca?: string;
  zona?: string;
  hasta?: number;
  anioDesde?: number;
};

export async function getPublicaciones(filtros: FiltrosCatalogo): Promise<Publicacion[]> {
  return PUBLICACIONES.filter(
    (p) =>
      p.estado === "activa" &&
      (!filtros.tipo || p.tipo === filtros.tipo) &&
      (!filtros.marca || p.marca === filtros.marca) &&
      (!filtros.zona || p.zona === filtros.zona) &&
      (!filtros.hasta || p.precio <= filtros.hasta) &&
      (!filtros.anioDesde || p.anio >= filtros.anioDesde),
  ).sort((a, b) => b.creado.localeCompare(a.creado));
}

export async function getPublicacion(id: string): Promise<Publicacion | null> {
  return PUBLICACIONES.find((p) => p.id === id && p.estado === "activa") ?? null;
}

/** Cantidad de publicaciones activas por tipo, para las pestañas del catálogo. */
export async function getCantidadPorTipo(): Promise<Record<TipoVehiculo, number>> {
  const cuenta: Record<TipoVehiculo, number> = { auto: 0, moto: 0, camion: 0, lancha: 0 };
  for (const p of PUBLICACIONES) if (p.estado === "activa") cuenta[p.tipo]++;
  return cuenta;
}

// ---- Administración ------------------------------------------------------------

const USUARIOS: Usuario[] = [
  { id: "u1", nombre: "Lucía Fernández", email: "lucia@example.com", telefono: "5491100000101", rol: "comprador", estado: "activo", creado: hace(24 * 29) },
  { id: "u2", nombre: "Martín Gómez", email: "martin.g@example.com", rol: "comprador", estado: "activo", creado: hace(24 * 6) },
  { id: "u3", nombre: "Carla Ruiz", email: "carla.ruiz@example.com", telefono: "5493510000103", rol: "comprador", estado: "activo", creado: hace(24 * 2) },
  { id: "u4", nombre: "Diego Sosa", email: "dsosa@example.com", rol: "comprador", estado: "suspendido", creado: hace(24 * 12) },
  { id: "u5", nombre: "Autos Morón", email: "ventas@autosmoron.example", telefono: "5491100000001", rol: "revendedor", estado: "activo", creado: hace(24 * 40) },
  { id: "u6", nombre: "Castelar Motors", email: "info@castelarmotors.example", telefono: "5491100000002", rol: "revendedor", estado: "activo", creado: hace(24 * 33) },
  { id: "u7", nombre: "Ramos Autos", email: "ramosautos@example.com", telefono: "5491100000003", rol: "revendedor", estado: "activo", creado: hace(24 * 8) },
  { id: "u8", nombre: "Náutica Tigre", email: "nautica@example.com", telefono: "5491100000005", rol: "revendedor", estado: "activo", creado: hace(24 * 15) },
  { id: "u9", nombre: "Mi agencia", email: "agencia@example.com", telefono: "5491100000009", rol: "revendedor", estado: "activo", creado: hace(24 * 46) },
];

/** Quién publicó cada pedido (en la API va a venir en el mismo pedido). */
const AUTOR_PEDIDO: Record<string, string> = {
  p1: "Lucía Fernández", p2: "Lucía Fernández", p3: "Lucía Fernández", p4: "Martín Gómez",
  p5: "Carla Ruiz", p6: "Martín Gómez", p7: "Diego Sosa", p8: "Carla Ruiz",
};

export async function getResumenAdmin() {
  return {
    compradores: USUARIOS.filter((u) => u.rol === "comprador").length,
    revendedores: USUARIOS.filter((u) => u.rol === "revendedor").length,
    suspendidos: USUARIOS.filter((u) => u.estado === "suspendido").length,
    pedidosActivos: PEDIDOS.filter((p) => p.estado === "activo").length,
    ofertas: OFERTAS.length,
    publicaciones: PUBLICACIONES.filter((p) => p.estado === "activa").length,
    ultimosPedidos: [...PEDIDOS].sort((a, b) => b.creado.localeCompare(a.creado)).slice(0, 3),
  };
}

export async function getUsuariosAdmin(busqueda?: string): Promise<Usuario[]> {
  const q = busqueda?.trim().toLowerCase();
  return USUARIOS.filter(
    (u) => !q || u.nombre.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
  ).sort((a, b) => b.creado.localeCompare(a.creado));
}

export async function getPedidosAdmin(): Promise<{ pedido: Pedido; autor: string }[]> {
  return [...PEDIDOS]
    .sort((a, b) => b.creado.localeCompare(a.creado))
    .map((pedido) => ({ pedido, autor: AUTOR_PEDIDO[pedido.id] ?? "—" }));
}

export async function getOfertasAdmin(): Promise<{ oferta: Oferta; pedido: Pedido }[]> {
  return OFERTAS.flatMap((oferta) => {
    const pedido = PEDIDOS.find((p) => p.id === oferta.pedidoId);
    return pedido ? [{ oferta, pedido }] : [];
  }).sort((a, b) => b.oferta.creado.localeCompare(a.oferta.creado));
}

export async function getPublicacionesAdmin(): Promise<Publicacion[]> {
  return [...PUBLICACIONES].sort((a, b) => b.creado.localeCompare(a.creado));
}
