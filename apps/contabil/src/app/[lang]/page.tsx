import { redirect } from "next/navigation";
import { getLocale } from "@/i18n/get-dictionary";

// Enquanto não há autenticação, a raiz do sistema leva ao login.
// Com autenticação, esta página vira o painel e o redirecionamento passa a
// depender de o usuário estar logado.
export default async function HomePage() {
  redirect(`/${await getLocale()}/login`);
}
