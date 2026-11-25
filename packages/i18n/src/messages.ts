import type { Locale } from "./config";

type SharedMessages = {
  /** Rótulo acessível do seletor de idioma. */
  language: string;
  notFound: {
    title: string;
    description: string;
    backHome: string;
  };
};

/**
 * Textos dos componentes compartilhados (@repo/ui), iguais em todos os apps.
 * Textos específicos de cada app ficam nos dicionários do próprio app.
 */
export const sharedMessages: Record<Locale, SharedMessages> = {
  it: {
    language: "Lingua",
    notFound: {
      title: "Pagina non trovata",
      description: "La pagina che cerchi non esiste o è stata spostata.",
      backHome: "Torna alla pagina iniziale",
    },
  },
  pt: {
    language: "Idioma",
    notFound: {
      title: "Página não encontrada",
      description: "A página que você procura não existe ou foi movida.",
      backHome: "Voltar para o início",
    },
  },
  es: {
    language: "Idioma",
    notFound: {
      title: "Página no encontrada",
      description: "La página que buscas no existe o ha sido movida.",
      backHome: "Volver al inicio",
    },
  },
  en: {
    language: "Language",
    notFound: {
      title: "Page not found",
      description: "The page you're looking for doesn't exist or has been moved.",
      backHome: "Back to home",
    },
  },
};
