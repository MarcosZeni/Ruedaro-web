"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ApiError, apiJson, COOKIE_SESION } from "@/lib/api";
import { inicioDeRol } from "@/lib/sesion";
import type { Usuario } from "@/lib/types";

/**
 * Estado de los formularios de cuenta. Si algo falla vuelve el mensaje de la
 * API, qué campo marcar y lo que el usuario había escrito (menos la
 * contraseña): que no tenga que completar todo de nuevo por un error.
 */
export type FormState = {
  error?: string;
  /** Código estable de la API ("patente_existente"...), para reaccionar distinto a ciertos errores. */
  codigo?: string;
  campo?: string;
  valores?: Record<string, string>;
  ok?: boolean;
};

type SesionApi = { token: string; expira: string; usuario: Usuario };

const texto = (fd: FormData, campo: string) => {
  const v = fd.get(campo);
  return typeof v === "string" ? v : "";
};

function estadoDeError(e: unknown, valores: Record<string, string>): FormState {
  if (e instanceof ApiError) return { error: e.message, campo: e.campo, valores };
  console.error(e);
  return { error: "Algo salió mal. Probá de nuevo.", valores };
}

async function guardarSesion({ token, expira }: SesionApi) {
  (await cookies()).set(COOKIE_SESION, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // lax: la cookie viaja al llegar desde un link (WhatsApp, Google), pero no
    // en formularios que otro sitio intente mandar a nombre del usuario.
    sameSite: "lax",
    path: "/",
    expires: new Date(expira),
  });
}

export async function registrarse(_prev: FormState, fd: FormData): Promise<FormState> {
  const valores = {
    rol: texto(fd, "rol"),
    nombre: texto(fd, "nombre"),
    email: texto(fd, "email"),
    telefono: texto(fd, "telefono"),
  };

  let sesion: SesionApi;
  try {
    sesion = await apiJson<SesionApi>("/api/v1/auth/registro", {
      method: "POST",
      token: null,
      body: JSON.stringify({ ...valores, password: texto(fd, "password") }),
    });
  } catch (e) {
    return estadoDeError(e, valores);
  }

  await guardarSesion(sesion);
  // Fuera del try: redirect() funciona tirando una excepción que Next tiene que ver.
  redirect(inicioDeRol(sesion.usuario.rol));
}

export async function ingresar(_prev: FormState, fd: FormData): Promise<FormState> {
  const valores = { email: texto(fd, "email") };

  let sesion: SesionApi;
  try {
    sesion = await apiJson<SesionApi>("/api/v1/auth/ingresar", {
      method: "POST",
      token: null,
      body: JSON.stringify({ email: valores.email, password: texto(fd, "password") }),
    });
  } catch (e) {
    return estadoDeError(e, valores);
  }

  await guardarSesion(sesion);
  redirect(inicioDeRol(sesion.usuario.rol));
}

export async function guardarCuenta(_prev: FormState, fd: FormData): Promise<FormState> {
  const valores = { nombre: texto(fd, "nombre"), telefono: texto(fd, "telefono") };
  try {
    await apiJson<Usuario>("/api/v1/auth/yo", { method: "PUT", body: JSON.stringify(valores) });
  } catch (e) {
    return estadoDeError(e, valores);
  }
  // Que el nombre nuevo se vea ya en el header y en la página.
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function cerrarSesion() {
  // Se borra la sesión en la API (que deja de valer en cualquier lado) y
  // después la cookie. Si la API no contesta, la cookie se borra igual: el
  // usuario pidió salir y en este navegador sale.
  try {
    await apiJson("/api/v1/auth/salir", { method: "POST" });
  } catch (e) {
    console.error("No se pudo cerrar la sesión en la API:", e);
  }
  (await cookies()).delete(COOKIE_SESION);
  redirect("/");
}
