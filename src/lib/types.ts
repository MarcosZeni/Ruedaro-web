// Tipos del dominio, con los mismos nombres que devuelve la API (ApiCore/Models).
// Los ids son texto: en la base son BIGINT y JavaScript pierde precisión.

export type Moneda = "USD" | "ARS";

/** Auto incluye camionetas, SUV y pickups; camión incluye utilitarios (Kangoo, Sprinter). */
export type TipoVehiculo = "auto" | "moto" | "camion" | "lancha";

/** baja = la bajó un administrador. */
export type EstadoPedido = "activo" | "cerrado" | "baja";

export type Pedido = {
  id: string;
  tipo: TipoVehiculo;
  marca: string;
  modelo: string;
  anioDesde: number;
  anioHasta: number;
  presupuesto: number;
  moneda: Moneda;
  /** El presupuesto en dólares, convertido con el dólar oficial al publicar. */
  presupuestoUsd?: number | null;
  /** Pesos por dólar usados al publicar (BCRA). */
  cotizacion?: number | null;
  zona: string;
  comentarios?: string | null;
  estado: EstadoPedido;
  /** ISO 8601 en UTC. */
  creado: string;
  cantidadOfertas: number;
  /** Solo para revendedores: si ya ofertó en este pedido. */
  yaOferte?: boolean | null;
};

export type Revendedor = {
  nombre: string;
  /** WhatsApp en formato E.164 sin el "+": 5491122334455. null si no lo cargó. */
  telefono: string | null;
};

export type Oferta = {
  id: string;
  pedidoId: string;
  tipo: TipoVehiculo;
  revendedor: Revendedor;
  marca: string;
  modelo: string;
  version: string;
  anio: number;
  /** Kilómetros, u horas de motor si es lancha (ver infoTipo().uso). */
  uso: number;
  precio: number;
  moneda: Moneda;
  precioUsd?: number | null;
  cotizacion?: number | null;
  link?: string | null;
  comentario?: string | null;
  estado: "visible" | "baja";
  /** ISO 8601 en UTC. */
  creado: string;
};

export type Rol = "comprador" | "revendedor" | "admin";

export type EstadoUsuario = "activo" | "suspendido";

export type Usuario = {
  id: string;
  nombre: string;
  email: string;
  /** WhatsApp en formato E.164 sin el "+". null hasta que lo cargue. */
  telefono?: string | null;
  rol: Rol;
  estado: EstadoUsuario;
  /** Plan de 10 destacados vigente hasta esta fecha (ISO, UTC). */
  planVence?: string | null;
  /** ISO 8601 en UTC. */
  creado: string;
};

export type Vendedor = "agencia" | "particular";

export type Cotizacion = { valor: number; fecha: string };

export type MisPublicaciones = {
  avisos: Publicacion[];
  destacadosUsados: number;
  destacadosMax: number;
  planVence?: string | null;
};

export type EstadoPublicacion = "activa" | "pausada" | "vendida" | "baja";

/** Vehículo que un revendedor publica en el catálogo ("Buscar"). */
export type Publicacion = {
  id: string;
  tipo: TipoVehiculo;
  marca: string;
  modelo: string;
  version: string;
  anio: number;
  /** Kilómetros, u horas de motor si es lancha. */
  uso: number;
  precio: number;
  moneda: Moneda;
  precioUsd?: number | null;
  cotizacion?: number | null;
  zona: string;
  descripcion?: string | null;
  revendedor: Revendedor;
  /** "agencia" (revendedor) o "particular". */
  vendedor: Vendedor;
  /** Solo llega al dueño del aviso y a los admins. */
  patente?: string | null;
  /** En el carrusel de la portada. */
  destacada: boolean;
  estado: EstadoPublicacion;
  /** ISO 8601 en UTC. */
  creado: string;
};
