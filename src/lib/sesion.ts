import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { ApiError, apiJson, COOKIE_SESION } from "@/lib/api";
import type { Rol, Usuario } from "@/lib/types";

// =============================================================================
// Sesión
//
// La cookie "sesion" (httpOnly) tiene el token; la API dice de quién es. Todo
// el resto del código usa solo getSesion() y requireRol().
//
// requireRol() en la página es comodidad (manda a cada uno a su lugar), no
// seguridad: la que decide si un usuario puede ver o hacer algo es la API.
// =============================================================================

/**
 * Usuario de la sesión, o null. cache(): el header, el layout y la página
 * preguntan lo mismo en un mismo pedido, y se le pregunta a la API una sola vez.
 *
 * Si la API no contesta, el error sube (y se ve la página de error): devolver
 * null mandaría a "Ingresar" a gente que tiene la sesión bien.
 */
export const getSesion = cache(async (): Promise<Usuario | null> => {
  if (!(await cookies()).get(COOKIE_SESION)?.value) return null;

  try {
    return await apiJson<Usuario>("/api/v1/auth/yo");
  } catch (e) {
    // Vencida, cerrada o de un usuario suspendido. La cookie vieja queda hasta
    // el próximo ingreso: en un Server Component no se pueden borrar cookies.
    if (e instanceof ApiError && e.status === 401) return null;
    throw e;
  }
});

/** Pantalla de inicio de cada rol: adonde va después de entrar. */
export function inicioDeRol(rol: Rol): string {
  return rol === "comprador" ? "/mis-pedidos" : rol === "revendedor" ? "/pedidos" : "/admin";
}

/**
 * Para las páginas de un panel. Sin sesión, a ingresar; con otro rol, a su
 * propio panel (un comprador que abre un link de revendedor no ve un error).
 */
export async function requireRol(...roles: Rol[]): Promise<Usuario> {
  const usuario = await getSesion();
  if (!usuario) redirect("/ingresar");
  if (roles.length > 0 && !roles.includes(usuario.rol)) redirect(inicioDeRol(usuario.rol));
  return usuario;
}
