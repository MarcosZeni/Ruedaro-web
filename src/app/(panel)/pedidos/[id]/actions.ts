"use server";

import { redirect } from "next/navigation";

/**
 * Envía la oferta de un revendedor.
 *
 * Demo: todavía no guarda. Cuando esté el endpoint: validar con zod, mandar
 * con apiFetch y dejar que la API haga cumplir las reglas (una oferta por
 * revendedor y pedido, tope de ofertas, pedido activo). Esas reglas tienen que
 * vivir en la API: la pantalla puede mostrarlas, pero no es la que las garantiza.
 * Las fotos van a necesitar subir el límite de tamaño de las Server Actions.
 */
export async function enviarOferta(formData: FormData) {
  void formData;
  redirect("/mis-ofertas?enviada=1");
}
