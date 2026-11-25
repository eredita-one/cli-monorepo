import { notFound } from "next/navigation";

// Qualquer URL inexistente dentro de um idioma (ex.: /it/xyz) cai aqui e
// mostra o not-found traduzido de [lang], em vez do 404 padrão do Next.
export default function CatchAllPage() {
  notFound();
}
