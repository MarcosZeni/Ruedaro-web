import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Rol, Usuario } from "@/lib/types";

// =============================================================================
// Sesión
//
// DEMO: la "sesión" es una cookie con el rol elegido, sin usuario ni
// contraseña de verdad. Cuando exista el login, getSesion() lee la cookie de
// sesión (token opaco, httpOnly) y le pregunta a la API quién es. El resto del
// código usa solo getSesion() y requireRol(), así que no cambia.
//
// requireRol() en la página es comodidad (manda a cada uno a su lugar), no
// seguridad: la que decide si un usuario puede ver o hacer algo es la API.
// =============================================================================

export const COOKIE_SESION_DEMO = "demo_rol";

const ROLES: Rol[] = ["comprador", "revendedor", "admin"];

const USUARIOS_DEMO: Record<Rol, Usuario> = {
  comprador: {
    id: "u1", nombre: "Lucía Fernández", email: "lucia@example.com", telefono: "5491100000101",
    rol: "comprador", estado: "activo", creado: "2026-09-01T12:00:00Z",
  },
  revendedor: {
    id: "u9", nombre: "Mi agencia", email: "agencia@example.com", telefono: "5491100000009",
    rol: "revendedor", estado: "activo", creado: "2026-08-15T12:00:00Z",
  },
  admin: {
    id: "u0", nombre: "Administración", email: "admin@example.com",
    rol: "admin", estado: "activo", creado: "2026-08-01T12:00:00Z",
  },
};

export async function getSesion(): Promise<Usuario | null> {
  const rol = (await cookies()).get(COOKIE_SESION_DEMO)?.value;
  const valido = ROLES.find((r) => r === rol);
  return valido ? USUARIOS_DEMO[valido] : null;
}

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
