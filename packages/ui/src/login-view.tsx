import type { ReactNode } from "react";

/**
 * Tela de login de todos os apps: painel da marca à esquerda (telas grandes) e o
 * formulário à direita. O app passa a marca, os textos de apresentação e o formulário.
 */
export function LoginView({
  brand,
  tagline,
  description,
  footer,
  heading,
  subheading,
  form,
  languageSwitcher,
}: {
  brand: ReactNode;
  tagline: string;
  description: string;
  footer: string;
  heading: string;
  subheading: string;
  form: ReactNode;
  languageSwitcher: ReactNode;
}) {
  return (
    <div className="grid flex-1 lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-brand-950 p-12 text-brand-50 lg:flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -bottom-32 size-96 rounded-full bg-brand-500/20 blur-3xl"
        />
        {brand}
        <div className="relative max-w-md space-y-4">
          <p className="text-3xl leading-tight font-semibold tracking-tight">{tagline}</p>
          <p className="text-brand-200/80">{description}</p>
        </div>
        <p className="relative text-sm text-brand-300/70">{footer}</p>
      </aside>

      <main className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-10 lg:hidden">{brand}</div>
          <h1 className="text-2xl font-semibold tracking-tight">{heading}</h1>
          <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">{subheading}</p>
          {form}
          <div className="mt-10 border-t border-zinc-200 pt-6 dark:border-zinc-800">
            {languageSwitcher}
          </div>
        </div>
      </main>
    </div>
  );
}
