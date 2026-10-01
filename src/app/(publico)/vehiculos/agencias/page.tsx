import type { Metadata } from "next";
import { Catalogo } from "../components/catalogo";

export const metadata: Metadata = { title: "Vehículos de agencias" };

export default async function Page({ searchParams }: PageProps<"/vehiculos/agencias">) {
  return <Catalogo vendedor="agencia" searchParams={await searchParams} />;
}
