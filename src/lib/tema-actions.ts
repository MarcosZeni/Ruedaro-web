"use server";

import { cookies } from "next/headers";
import { COOKIE_TEMA, TEMAS } from "@/lib/tema";

/** Guarda el tema elegido. Un valor que no está en la lista se ignora. */
export async function cambiarTema(formData: FormData) {
  const tema = TEMAS.find((t) => t === formData.get("tema"));
  if (!tema) return;

  const store = await cookies();
  if (tema === "auto") {
    store.delete(COOKIE_TEMA);
    return;
  }
  store.set(COOKIE_TEMA, tema, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
}
