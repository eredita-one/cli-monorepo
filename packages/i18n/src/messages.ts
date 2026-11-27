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

/** Erros da troca de senha que a tela sabe explicar (da API ou do próprio front). */
export const PASSWORD_ERROR_CODES = [
  "AUTH_CURRENT_PASSWORD_INVALID",
  "AUTH_PASSWORD_WEAK",
  "AUTH_PASSWORD_UNCHANGED",
  "PASSWORD_MISMATCH",
  "AUTH_ACCOUNT_LOCKED",
  "TOO_MANY_REQUESTS",
  "VALIDATION_FAILED",
  "API_UNREACHABLE",
  "UNKNOWN",
] as const;

export type PasswordErrorCode = (typeof PASSWORD_ERROR_CODES)[number];

export function isPasswordErrorCode(code: string): code is PasswordErrorCode {
  return (PASSWORD_ERROR_CODES as readonly string[]).includes(code);
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
    sidebar: string;
    openMenu: string;
    closeMenu: string;
    collapseSidebar: string;
    expandSidebar: string;
    hideSidebar: string;
    showSidebar: string;
    /** Texto do botão no pé da barra lateral. */
    collapse: string;
    breadcrumbs: string;
    workspace: string;
    switchWorkspace: string;
    search: string;
    searchPlaceholder: string;
    searchEmpty: string;
    notifications: string;
    notificationsEmpty: string;
    account: string;
    /** Título do modal de troca de idioma. */
    chooseLanguage: string;
    close: string;
    preferences: string;
    help: string;
    helpTitle: string;
    helpBody: string;
    helpCta: string;
    footerNote: string;
  };
  /** Preferências de quem está logado: os próprios dados e a troca da senha. */
  preferences: {
    title: string;
    kicker: string;
    description: string;
    dataTitle: string;
    dataHint: string;
    name: string;
    email: string;
    areas: string;
    languageTitle: string;
    languageHint: string;
    languageCurrent: string;
    languageChange: string;
    passwordTitle: string;
    /** `{min}` = mínimo de caracteres. */
    passwordHint: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    submit: string;
    submitting: string;
    success: string;
    /** `{minLength}`, `{maxLength}` e `{minutes}` são preenchidos quando vêm da API. */
    errors: Record<PasswordErrorCode, string>;
  };
  /** Página de um módulo que ainda não tem tela. */
  module: {
    kicker: string;
    note: string;
    back: string;
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
      sidebar: "Barra laterale",
      openMenu: "Apri il menu",
      closeMenu: "Chiudi il menu",
      collapseSidebar: "Comprimi il menu laterale",
      expandSidebar: "Espandi il menu laterale",
      hideSidebar: "Nascondi il menu laterale",
      showSidebar: "Mostra il menu laterale",
      collapse: "Comprimi il menu",
      breadcrumbs: "Percorso di navigazione",
      workspace: "Workspace",
      switchWorkspace: "Vai a",
      search: "Cerca nel pannello",
      searchPlaceholder: "Cerca pagine…",
      searchEmpty: "Nessuna pagina trovata.",
      notifications: "Notifiche",
      notificationsEmpty: "Nessuna novità per ora.",
      account: "Menu dell'account",
      chooseLanguage: "Scegli la lingua",
      close: "Chiudi",
      preferences: "Preferenze",
      help: "Centro assistenza",
      helpTitle: "Serve aiuto?",
      helpBody: "Siamo qui per supportarti.",
      helpCta: "Vai all'assistenza",
      footerNote: "Sicurezza e privacy al primo posto",
    },
    preferences: {
      title: "Preferenze",
      kicker: "Il mio account",
      description: "I tuoi dati di accesso, la lingua e la password.",
      dataTitle: "I miei dati",
      dataHint: "Per correggere nome o e-mail, rivolgiti all'amministrazione.",
      name: "Nome",
      email: "E-mail",
      areas: "Aree di accesso",
      languageTitle: "Lingua",
      languageHint: "La lingua in cui viene mostrato il pannello. La scelta resta salvata in questo browser.",
      languageCurrent: "Lingua attuale",
      languageChange: "Cambia lingua",
      passwordTitle: "Password",
      passwordHint: "Usa almeno {min} caratteri. Cambiandola, le altre sessioni vengono chiuse; questa resta aperta.",
      currentPassword: "Password attuale",
      newPassword: "Nuova password",
      confirmPassword: "Conferma la nuova password",
      submit: "Cambia password",
      submitting: "Modifica in corso…",
      success: "Password cambiata. Le altre sessioni sono state chiuse.",
      errors: {
        AUTH_CURRENT_PASSWORD_INVALID: "La password attuale non è corretta.",
        AUTH_PASSWORD_WEAK: "La nuova password deve avere tra {minLength} e {maxLength} caratteri.",
        AUTH_PASSWORD_UNCHANGED: "La nuova password deve essere diversa da quella attuale.",
        PASSWORD_MISMATCH: "La conferma non corrisponde alla nuova password.",
        AUTH_ACCOUNT_LOCKED: "Troppi tentativi non riusciti. Riprova tra {minutes} minuti.",
        TOO_MANY_REQUESTS: "Troppi tentativi da questa connessione. Attendi un minuto.",
        VALIDATION_FAILED: "Controlla i campi compilati.",
        API_UNREACHABLE: "Servizio momentaneamente non disponibile. Riprova tra poco.",
        UNKNOWN: "Non è stato possibile cambiare la password. Riprova.",
      },
    },
    module: {
      kicker: "In costruzione",
      note: "Questo modulo è in preparazione e arriverà nelle prossime versioni.",
      back: "Torna alla panoramica",
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
      sidebar: "Barra lateral",
      openMenu: "Abrir menu",
      closeMenu: "Fechar menu",
      collapseSidebar: "Recolher menu lateral",
      expandSidebar: "Expandir menu lateral",
      hideSidebar: "Ocultar menu lateral",
      showSidebar: "Mostrar menu lateral",
      collapse: "Recolher menu",
      breadcrumbs: "Trilha de navegação",
      workspace: "Workspace",
      switchWorkspace: "Ir para",
      search: "Buscar no painel",
      searchPlaceholder: "Buscar páginas…",
      searchEmpty: "Nenhuma página encontrada.",
      notifications: "Notificações",
      notificationsEmpty: "Nada de novo por enquanto.",
      account: "Menu da conta",
      chooseLanguage: "Escolher idioma",
      close: "Fechar",
      preferences: "Preferências",
      help: "Central de ajuda",
      helpTitle: "Precisa de ajuda?",
      helpBody: "Estamos por aqui para apoiar.",
      helpCta: "Acessar suporte",
      footerNote: "Segurança e privacidade em primeiro lugar",
    },
    preferences: {
      title: "Preferências",
      kicker: "Minha conta",
      description: "Seus dados de acesso, o idioma e a sua senha.",
      dataTitle: "Meus dados",
      dataHint: "Para corrigir o nome ou o e-mail, fale com a administração.",
      name: "Nome",
      email: "E-mail",
      areas: "Áreas de acesso",
      languageTitle: "Idioma",
      languageHint: "O idioma em que o painel é exibido. A escolha fica salva neste navegador.",
      languageCurrent: "Idioma atual",
      languageChange: "Alterar idioma",
      passwordTitle: "Senha",
      passwordHint: "Use pelo menos {min} caracteres. Ao trocar, as suas outras sessões são encerradas; esta continua aberta.",
      currentPassword: "Senha atual",
      newPassword: "Nova senha",
      confirmPassword: "Confirmar a nova senha",
      submit: "Trocar senha",
      submitting: "Trocando…",
      success: "Senha trocada. As outras sessões foram encerradas.",
      errors: {
        AUTH_CURRENT_PASSWORD_INVALID: "A senha atual não confere.",
        AUTH_PASSWORD_WEAK: "A nova senha precisa ter entre {minLength} e {maxLength} caracteres.",
        AUTH_PASSWORD_UNCHANGED: "A nova senha precisa ser diferente da atual.",
        PASSWORD_MISMATCH: "A confirmação não confere com a nova senha.",
        AUTH_ACCOUNT_LOCKED: "Muitas tentativas sem sucesso. Tente de novo em {minutes} minutos.",
        TOO_MANY_REQUESTS: "Muitas tentativas a partir desta conexão. Aguarde um minuto.",
        VALIDATION_FAILED: "Confira os campos preenchidos.",
        API_UNREACHABLE: "Serviço indisponível no momento. Tente novamente em instantes.",
        UNKNOWN: "Não foi possível trocar a senha. Tente novamente.",
      },
    },
    module: {
      kicker: "Em construção",
      note: "Este módulo está sendo preparado e chega nas próximas versões.",
      back: "Voltar à visão geral",
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
      sidebar: "Barra lateral",
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
      collapseSidebar: "Contraer el menú lateral",
      expandSidebar: "Expandir el menú lateral",
      hideSidebar: "Ocultar el menú lateral",
      showSidebar: "Mostrar el menú lateral",
      collapse: "Contraer menú",
      breadcrumbs: "Ruta de navegación",
      workspace: "Workspace",
      switchWorkspace: "Ir a",
      search: "Buscar en el panel",
      searchPlaceholder: "Buscar páginas…",
      searchEmpty: "No se encontró ninguna página.",
      notifications: "Notificaciones",
      notificationsEmpty: "No hay novedades por ahora.",
      account: "Menú de la cuenta",
      chooseLanguage: "Elegir idioma",
      close: "Cerrar",
      preferences: "Preferencias",
      help: "Centro de ayuda",
      helpTitle: "¿Necesitas ayuda?",
      helpBody: "Estamos aquí para apoyarte.",
      helpCta: "Ir al soporte",
      footerNote: "Seguridad y privacidad ante todo",
    },
    preferences: {
      title: "Preferencias",
      kicker: "Mi cuenta",
      description: "Tus datos de acceso, el idioma y tu contraseña.",
      dataTitle: "Mis datos",
      dataHint: "Para corregir el nombre o el correo, contacta con la administración.",
      name: "Nombre",
      email: "Correo electrónico",
      areas: "Áreas de acceso",
      languageTitle: "Idioma",
      languageHint: "El idioma en que se muestra el panel. La elección se guarda en este navegador.",
      languageCurrent: "Idioma actual",
      languageChange: "Cambiar idioma",
      passwordTitle: "Contraseña",
      passwordHint: "Usa al menos {min} caracteres. Al cambiarla, se cierran tus otras sesiones; esta sigue abierta.",
      currentPassword: "Contraseña actual",
      newPassword: "Nueva contraseña",
      confirmPassword: "Confirmar la nueva contraseña",
      submit: "Cambiar contraseña",
      submitting: "Cambiando…",
      success: "Contraseña cambiada. Se cerraron las otras sesiones.",
      errors: {
        AUTH_CURRENT_PASSWORD_INVALID: "La contraseña actual no es correcta.",
        AUTH_PASSWORD_WEAK: "La nueva contraseña debe tener entre {minLength} y {maxLength} caracteres.",
        AUTH_PASSWORD_UNCHANGED: "La nueva contraseña debe ser distinta de la actual.",
        PASSWORD_MISMATCH: "La confirmación no coincide con la nueva contraseña.",
        AUTH_ACCOUNT_LOCKED: "Demasiados intentos fallidos. Vuelve a intentarlo en {minutes} minutos.",
        TOO_MANY_REQUESTS: "Demasiados intentos desde esta conexión. Espera un minuto.",
        VALIDATION_FAILED: "Revisa los campos completados.",
        API_UNREACHABLE: "Servicio no disponible en este momento. Inténtalo de nuevo en breve.",
        UNKNOWN: "No se pudo cambiar la contraseña. Inténtalo de nuevo.",
      },
    },
    module: {
      kicker: "En construcción",
      note: "Este módulo se está preparando y llegará en las próximas versiones.",
      back: "Volver a la vista general",
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
      sidebar: "Sidebar",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      collapseSidebar: "Collapse sidebar",
      expandSidebar: "Expand sidebar",
      hideSidebar: "Hide sidebar",
      showSidebar: "Show sidebar",
      collapse: "Collapse menu",
      breadcrumbs: "Breadcrumb",
      workspace: "Workspace",
      switchWorkspace: "Go to",
      search: "Search the dashboard",
      searchPlaceholder: "Search pages…",
      searchEmpty: "No pages found.",
      notifications: "Notifications",
      notificationsEmpty: "Nothing new for now.",
      account: "Account menu",
      chooseLanguage: "Choose language",
      close: "Close",
      preferences: "Preferences",
      help: "Help center",
      helpTitle: "Need help?",
      helpBody: "We're here to support you.",
      helpCta: "Go to support",
      footerNote: "Security and privacy first",
    },
    preferences: {
      title: "Preferences",
      kicker: "My account",
      description: "Your sign-in details, language and password.",
      dataTitle: "My details",
      dataHint: "To correct your name or email, contact the administration.",
      name: "Name",
      email: "Email",
      areas: "Access areas",
      languageTitle: "Language",
      languageHint: "The language this dashboard is shown in. Your choice is saved in this browser.",
      languageCurrent: "Current language",
      languageChange: "Change language",
      passwordTitle: "Password",
      passwordHint: "Use at least {min} characters. Changing it signs out your other sessions; this one stays open.",
      currentPassword: "Current password",
      newPassword: "New password",
      confirmPassword: "Confirm new password",
      submit: "Change password",
      submitting: "Changing…",
      success: "Password changed. Your other sessions were signed out.",
      errors: {
        AUTH_CURRENT_PASSWORD_INVALID: "The current password is incorrect.",
        AUTH_PASSWORD_WEAK: "The new password must have between {minLength} and {maxLength} characters.",
        AUTH_PASSWORD_UNCHANGED: "The new password must be different from the current one.",
        PASSWORD_MISMATCH: "The confirmation doesn't match the new password.",
        AUTH_ACCOUNT_LOCKED: "Too many failed attempts. Try again in {minutes} minutes.",
        TOO_MANY_REQUESTS: "Too many attempts from this connection. Please wait a minute.",
        VALIDATION_FAILED: "Check the fields you filled in.",
        API_UNREACHABLE: "The service is unavailable right now. Please try again shortly.",
        UNKNOWN: "We couldn't change your password. Please try again.",
      },
    },
    module: {
      kicker: "Under construction",
      note: "This module is being prepared and will arrive in upcoming releases.",
      back: "Back to overview",
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
