import "server-only";

import { cookies } from "next/headers";

// Preferencia de tema del usuario. Va en una cookie y no en localStorage para
// que el servidor mande la página ya con el tema puesto: sin parpadeo y sin
// script en el <head>.

export const TEMAS = ["auto", "claro", "oscuro"] as const;
export type Tema = (typeof TEMAS)[number];

export const COOKIE_TEMA = "tema";

export async function getTema(): Promise<Tema> {
  const valor = (await cookies()).get(COOKIE_TEMA)?.value;
  return TEMAS.find((t) => t === valor) ?? "auto";
}

/** Valor del atributo data-theme de <html>. Sin atributo = sigue al sistema. */
export function dataTheme(tema: Tema): "light" | "dark" | undefined {
  return tema === "claro" ? "light" : tema === "oscuro" ? "dark" : undefined;
}
