"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_SESION_DEMO, inicioDeRol } from "@/lib/sesion";
import type { Rol } from "@/lib/types";

// DEMO: entrar y registrarse solo guardan el rol. Cuando exista el login, acá
// se valida con zod, se llama a la API (que verifica la contraseña con
// Argon2id y aplica el freno por IP) y se guarda el token de sesión que
// devuelve, en una cookie httpOnly.

const ROLES_PUBLICOS: Rol[] = ["comprador", "revendedor"];

async function iniciarSesionDemo(rol: Rol) {
  (await cookies()).set(COOKIE_SESION_DEMO, rol, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect(inicioDeRol(rol));
}

export async function registrarse(formData: FormData) {
  // Admin no se elige al registrarse: se asigna a mano en la base.
  const rol = ROLES_PUBLICOS.find((r) => r === formData.get("rol")) ?? "comprador";
  await iniciarSesionDemo(rol);
}

export async function ingresar(formData: FormData) {
  void formData;
  // Sin usuarios reales, entra como el rol que tenía o como comprador.
  const previo = (await cookies()).get(COOKIE_SESION_DEMO)?.value;
  const rol = (["comprador", "revendedor", "admin"] as Rol[]).find((r) => r === previo) ?? "comprador";
  await iniciarSesionDemo(rol);
}

/** Atajo del aviso de demostración para ver cada panel. */
export async function verComo(formData: FormData) {
  const rol = (["comprador", "revendedor", "admin"] as Rol[]).find((r) => r === formData.get("rol"));
  if (rol) await iniciarSesionDemo(rol);
}

export async function cerrarSesion() {
  (await cookies()).delete(COOKIE_SESION_DEMO);
  redirect("/");
}
