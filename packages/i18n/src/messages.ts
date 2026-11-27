import type { Locale } from "./config";

/** Códigos de erro do login que a tela sabe explicar (vêm da API ou do próprio front). */
export const AUTH_ERROR_CODES = [
  "AUTH_INVALID_CREDENTIALS",
  "AUTH_ACCOUNT_LOCKED",
  "AUTH_ACCOUNT_DISABLED",
  "AUTH_APP_FORBIDDEN",
  "TOO_MANY_REQUESTS",
  "VALIDATION_FAILED",
  "API_UNREACHABLE",
  "UNKNOWN",
] as const;

export type AuthErrorCode = (typeof AUTH_ERROR_CODES)[number];

export function isAuthErrorCode(code: string): code is AuthErrorCode {
  return (AUTH_ERROR_CODES as readonly string[]).includes(code);
}

type SharedMessages = {
  /** Rótulo acessível do seletor de idioma. */
  language: string;
  notFound: {
    title: string;
    description: string;
    backHome: string;
  };
  /** Tela de login (igual em todos os apps; cada app só muda os textos de apresentação). */
  auth: {
    title: string;
    heading: string;
    subheading: string;
    form: {
      email: string;
      emailPlaceholder: string;
      password: string;
      forgotPassword: string;
      show: string;
      hide: string;
      showPassword: string;
      hidePassword: string;
      remember: string;
      submit: string;
      submitting: string;
    };
    /** `{minutes}` é preenchido no bloqueio por tentativas. */
    errors: Record<AuthErrorCode, string>;
  };
  /** Moldura das áreas logadas. */
  shell: {
    navigation: string;
    logout: string;
    loggingOut: string;
    loading: string;
  };
  /** Página de demonstração após o login, nos apps ainda sem conteúdo. */
  demo: {
    title: string;
    badge: string;
    /** `{name}` = nome de quem entrou. */
    greeting: string;
    body: string;
    sessionTitle: string;
    email: string;
    apps: string;
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
    auth: {
      title: "Accedi",
      heading: "Accedi al tuo account",
      subheading: "Inserisci la tua e-mail e la password per continuare.",
      form: {
        email: "E-mail",
        emailPlaceholder: "nome@azienda.it",
        password: "Password",
        forgotPassword: "Password dimenticata?",
        show: "Mostra",
        hide: "Nascondi",
        showPassword: "Mostra password",
        hidePassword: "Nascondi password",
        remember: "Resta connesso",
        submit: "Accedi",
        submitting: "Accesso in corso…",
      },
      errors: {
        AUTH_INVALID_CREDENTIALS: "E-mail o password non corretti.",
        AUTH_ACCOUNT_LOCKED:
          "Troppi tentativi non riusciti. Riprova tra {minutes} minuti.",
        AUTH_ACCOUNT_DISABLED:
          "Questo account è disattivato. Contatta l'amministrazione.",
        AUTH_APP_FORBIDDEN: "Il tuo account non ha accesso a questa area.",
        TOO_MANY_REQUESTS:
          "Troppi tentativi da questa connessione. Attendi un minuto.",
        VALIDATION_FAILED: "Controlla l'e-mail e la password inserite.",
        API_UNREACHABLE:
          "Servizio momentaneamente non disponibile. Riprova tra poco.",
        UNKNOWN: "Non è stato possibile accedere. Riprova.",
      },
    },
    shell: {
      navigation: "Navigazione",
      logout: "Esci",
      loggingOut: "Uscita…",
      loading: "Caricamento…",
    },
    demo: {
      title: "Dimostrazione",
      badge: "Area in costruzione",
      greeting: "Ciao, {name}",
      body: "L'accesso funziona. I contenuti di questa area saranno disponibili presto.",
      sessionTitle: "La tua sessione",
      email: "E-mail",
      apps: "Aree a cui hai accesso",
    },
  },
  pt: {
    language: "Idioma",
    notFound: {
      title: "Página não encontrada",
      description: "A página que você procura não existe ou foi movida.",
      backHome: "Voltar para o início",
    },
    auth: {
      title: "Entrar",
      heading: "Acesse sua conta",
      subheading: "Entre com seu e-mail e senha para continuar.",
      form: {
        email: "E-mail",
        emailPlaceholder: "voce@empresa.com.br",
        password: "Senha",
        forgotPassword: "Esqueceu a senha?",
        show: "Mostrar",
        hide: "Ocultar",
        showPassword: "Mostrar senha",
        hidePassword: "Ocultar senha",
        remember: "Manter conectado",
        submit: "Entrar",
        submitting: "Entrando…",
      },
      errors: {
        AUTH_INVALID_CREDENTIALS: "E-mail ou senha incorretos.",
        AUTH_ACCOUNT_LOCKED:
          "Muitas tentativas sem sucesso. Tente de novo em {minutes} minutos.",
        AUTH_ACCOUNT_DISABLED:
          "Esta conta está desativada. Fale com a administração.",
        AUTH_APP_FORBIDDEN: "Sua conta não tem acesso a esta área.",
        TOO_MANY_REQUESTS:
          "Muitas tentativas a partir desta conexão. Aguarde um minuto.",
        VALIDATION_FAILED: "Confira o e-mail e a senha informados.",
        API_UNREACHABLE:
          "Serviço indisponível no momento. Tente novamente em instantes.",
        UNKNOWN: "Não foi possível entrar. Tente novamente.",
      },
    },
    shell: {
      navigation: "Navegação",
      logout: "Sair",
      loggingOut: "Saindo…",
      loading: "Carregando…",
    },
    demo: {
      title: "Demonstração",
      badge: "Área em construção",
      greeting: "Olá, {name}",
      body: "O acesso está funcionando. O conteúdo desta área chega em breve.",
      sessionTitle: "Sua sessão",
      email: "E-mail",
      apps: "Áreas a que você tem acesso",
    },
  },
  es: {
    language: "Idioma",
    notFound: {
      title: "Página no encontrada",
      description: "La página que buscas no existe o ha sido movida.",
      backHome: "Volver al inicio",
    },
    auth: {
      title: "Iniciar sesión",
      heading: "Accede a tu cuenta",
      subheading: "Introduce tu correo y contraseña para continuar.",
      form: {
        email: "Correo electrónico",
        emailPlaceholder: "tu@empresa.com",
        password: "Contraseña",
        forgotPassword: "¿Olvidaste tu contraseña?",
        show: "Mostrar",
        hide: "Ocultar",
        showPassword: "Mostrar contraseña",
        hidePassword: "Ocultar contraseña",
        remember: "Mantener la sesión iniciada",
        submit: "Entrar",
        submitting: "Entrando…",
      },
      errors: {
        AUTH_INVALID_CREDENTIALS: "Correo o contraseña incorrectos.",
        AUTH_ACCOUNT_LOCKED:
          "Demasiados intentos fallidos. Vuelve a intentarlo en {minutes} minutos.",
        AUTH_ACCOUNT_DISABLED:
          "Esta cuenta está desactivada. Contacta con la administración.",
        AUTH_APP_FORBIDDEN: "Tu cuenta no tiene acceso a esta área.",
        TOO_MANY_REQUESTS:
          "Demasiados intentos desde esta conexión. Espera un minuto.",
        VALIDATION_FAILED: "Revisa el correo y la contraseña.",
        API_UNREACHABLE:
          "Servicio no disponible en este momento. Inténtalo de nuevo en breve.",
        UNKNOWN: "No se pudo iniciar sesión. Inténtalo de nuevo.",
      },
    },
    shell: {
      navigation: "Navegación",
      logout: "Salir",
      loggingOut: "Saliendo…",
      loading: "Cargando…",
    },
    demo: {
      title: "Demostración",
      badge: "Área en construcción",
      greeting: "Hola, {name}",
      body: "El acceso funciona. El contenido de esta área llegará pronto.",
      sessionTitle: "Tu sesión",
      email: "Correo electrónico",
      apps: "Áreas a las que tienes acceso",
    },
  },
  en: {
    language: "Language",
    notFound: {
      title: "Page not found",
      description: "The page you're looking for doesn't exist or has been moved.",
      backHome: "Back to home",
    },
    auth: {
      title: "Sign in",
      heading: "Sign in to your account",
      subheading: "Enter your email and password to continue.",
      form: {
        email: "Email",
        emailPlaceholder: "you@company.com",
        password: "Password",
        forgotPassword: "Forgot your password?",
        show: "Show",
        hide: "Hide",
        showPassword: "Show password",
        hidePassword: "Hide password",
        remember: "Keep me signed in",
        submit: "Sign in",
        submitting: "Signing in…",
      },
      errors: {
        AUTH_INVALID_CREDENTIALS: "Incorrect email or password.",
        AUTH_ACCOUNT_LOCKED:
          "Too many failed attempts. Try again in {minutes} minutes.",
        AUTH_ACCOUNT_DISABLED:
          "This account is disabled. Please contact the administration.",
        AUTH_APP_FORBIDDEN: "Your account doesn't have access to this area.",
        TOO_MANY_REQUESTS:
          "Too many attempts from this connection. Please wait a minute.",
        VALIDATION_FAILED: "Check the email and password you entered.",
        API_UNREACHABLE:
          "The service is unavailable right now. Please try again shortly.",
        UNKNOWN: "We couldn't sign you in. Please try again.",
      },
    },
    shell: {
      navigation: "Navigation",
      logout: "Sign out",
      loggingOut: "Signing out…",
      loading: "Loading…",
    },
    demo: {
      title: "Demo",
      badge: "Under construction",
      greeting: "Hello, {name}",
      body: "Sign-in is working. The content for this area is coming soon.",
      sessionTitle: "Your session",
      email: "Email",
      apps: "Areas you can access",
    },
  },
};
