import type { TipoVehiculo } from "@/lib/types";

// Listas fijas de los formularios y filtros. Que el usuario elija de una lista
// en vez de escribir evita errores ("Volkswagen", "VW", "wolswagen") y hace que
// los filtros encuentren lo que tienen que encontrar.

type InfoTipo = {
  valor: TipoVehiculo;
  /** Para pestañas y filtros: "Autos y camionetas". */
  label: string;
  /** Para frases: "Busco una moto". */
  singular: string;
  /** Cómo se mide el uso: kilómetros, o horas de motor en las lanchas. */
  uso: { label: string; unidad: string; ejemplo: string };
};

const KM = { label: "Kilómetros", unidad: "km", ejemplo: "62.000" };

export const TIPOS: InfoTipo[] = [
  { valor: "auto", label: "Autos y camionetas", singular: "auto", uso: KM },
  { valor: "moto", label: "Motos", singular: "moto", uso: KM },
  { valor: "camion", label: "Camiones y utilitarios", singular: "camión o utilitario", uso: KM },
  { valor: "lancha", label: "Lanchas", singular: "lancha", uso: { label: "Horas de motor", unidad: "h", ejemplo: "350" } },
];

export function infoTipo(tipo: TipoVehiculo): InfoTipo {
  return TIPOS.find((t) => t.valor === tipo) ?? TIPOS[0];
}

/** Valida un tipo que viene de la URL o de un formulario. */
export function parseTipo(valor: unknown): TipoVehiculo | undefined {
  return TIPOS.find((t) => t.valor === valor)?.valor;
}

export const MARCAS: Record<TipoVehiculo, readonly string[]> = {
  auto: [
    "Chevrolet", "Citroën", "Fiat", "Ford", "Honda", "Hyundai", "Jeep", "Kia",
    "Nissan", "Peugeot", "Renault", "Toyota", "Volkswagen", "Otra",
  ],
  moto: [
    "Bajaj", "Benelli", "BMW", "Corven", "Gilera", "Honda", "Kawasaki", "KTM",
    "Motomel", "Suzuki", "Yamaha", "Zanella", "Otra",
  ],
  camion: [
    "Citroën", "Fiat", "Ford", "Iveco", "Mercedes-Benz", "Peugeot", "Renault",
    "Scania", "Toyota", "Volkswagen", "Otra",
  ],
  lancha: [
    "Bermuda", "Canestrari", "Klase A", "Quicksilver", "Regnicoli", "Tracker", "Otra",
  ],
};

/** Una marca es válida si está en la lista de ese tipo. */
export function parseMarca(tipo: TipoVehiculo | undefined, valor: unknown): string | undefined {
  const lista = tipo ? MARCAS[tipo] : Object.values(MARCAS).flat();
  return lista.find((m) => m === valor);
}

export const ZONAS = [
  "CABA",
  "GBA Norte",
  "GBA Oeste",
  "GBA Sur",
  "La Plata",
  "Interior de Buenos Aires",
  "Córdoba",
  "Santa Fe",
  "Mendoza",
  "Tucumán",
  "Resto del país",
] as const;

/** Años elegibles, del más nuevo al más viejo. */
export function aniosDisponibles(): number[] {
  const actual = new Date().getFullYear();
  return Array.from({ length: actual - 1980 + 2 }, (_, i) => actual + 1 - i);
}

/**
 * Tope de ofertas que recibe un pedido, para que al comprador no le llegue
 * spam. El número está a definir; 10 es provisorio.
 */
export const MAX_OFERTAS_POR_PEDIDO = 10;

/** Rangos del filtro "precio hasta", en USD. */
export const RANGOS_PRECIO_USD = [2_000, 5_000, 10_000, 15_000, 20_000, 30_000, 50_000, 100_000] as const;
