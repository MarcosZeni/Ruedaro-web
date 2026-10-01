"use server";

import { redirect } from "next/navigation";

/**
 * Publica el pedido.
 *
 * Demo: todavía no guarda. Cuando esté el endpoint, acá va: validar el
 * formulario con zod (marca y zona dentro del catálogo, años en orden,
 * presupuesto positivo), mandarlo con apiFetch y, si la API rechaza, volver al
 * formulario con el error. La validación del navegador (required, pattern) es
 * comodidad para el usuario, no seguridad: la que vale es la de acá y la de la API.
 */
export async function publicarPedido(formData: FormData) {
  void formData;
  redirect("/mis-pedidos?publicado=1");
}
