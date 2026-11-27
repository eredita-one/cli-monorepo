import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { locales } from "@repo/i18n/config";
import { BRAND_NAME } from "@/brand";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Pré-gera as páginas de cada idioma (obrigatório com Cache Components).
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    // O template vale para rotas filhas; páginas no mesmo nível usam o `default`.
    title: { template: `%s | ${BRAND_NAME}`, default: BRAND_NAME },
    description: dict.metadata.description,
  };
}

export default async function RootLayout({
  children,
}: LayoutProps<"/[lang]">) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
