import { redirect } from "next/navigation";

// /vehiculos sin sección: a la de agencias, que es el foco del sitio. Se
// conserva el tipo si vino en el link (por ejemplo, desde la portada).
export default async function VehiculosPage({ searchParams }: PageProps<"/vehiculos">) {
  const { tipo } = await searchParams;
  redirect(typeof tipo === "string" ? `/vehiculos/agencias?tipo=${encodeURIComponent(tipo)}` : "/vehiculos/agencias");
}
