// Tipos del dominio, con los mismos nombres que va a devolver la API. Hoy se
// llenan con datos de ejemplo (demo-data.ts); después, con apiFetch.

export type Moneda = "USD" | "ARS";

/** Auto incluye camionetas, SUV y pickups; camión incluye utilitarios (Kangoo, Sprinter). */
export type TipoVehiculo = "auto" | "moto" | "camion" | "lancha";

export type EstadoPedido = "activo" | "cerrado";

export type Pedido = {
  id: string;
  tipo: TipoVehiculo;
  marca: string;
  modelo: string;
  anioDesde: number;
  anioHasta: number;
  presupuesto: number;
  moneda: Moneda;
  zona: string;
  comentarios?: string;
  estado: EstadoPedido;
  /** ISO 8601 en UTC. */
  creado: string;
  cantidadOfertas: number;
};

export type Revendedor = {
  nombre: string;
  zona: string;
  /** WhatsApp en formato E.164 sin el "+": 5491122334455. */
  telefono: string;
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
  link?: string;
  comentario?: string;
  /** ISO 8601 en UTC. */
  creado: string;
};

export type Rol = "comprador" | "revendedor" | "admin";

export type EstadoUsuario = "activo" | "suspendido";

export type Usuario = {
  id: string;
  nombre: string;
  email: string;
  /** WhatsApp en formato E.164 sin el "+". Opcional hasta que lo cargue. */
  telefono?: string;
  rol: Rol;
  estado: EstadoUsuario;
  /** ISO 8601 en UTC. */
  creado: string;
};

export type EstadoPublicacion = "activa" | "pausada" | "vendida";

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
  zona: string;
  descripcion?: string;
  revendedor: Revendedor;
  estado: EstadoPublicacion;
  /** ISO 8601 en UTC. */
  creado: string;
};
