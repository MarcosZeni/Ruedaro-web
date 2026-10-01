import type { Metadata } from "next";
import { Catalogo } from "../components/catalogo";

export const metadata: Metadata = { title: "Vehículos de particulares" };

export default async function Page({ searchParams }: PageProps<"/vehiculos/particulares">) {
  return <Catalogo vendedor="particular" searchParams={await searchParams} />;
}
