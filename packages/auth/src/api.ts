// Chamadas HTTP à api-backend. Só no servidor (proxy, Server Components e Actions):
// o navegador nunca fala com a API nem vê os tokens.

export type TokenPair = {
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshToken: string;
  refreshTokenExpiresAt: string;
};

/** Erro devolvido pela API (`{ statusCode, code, message, details }`) ou de rede. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Quem está no navegador: repassado à API para limite de tentativas e registro da sessão. */
export type ForwardedClient = {
  ip?: string | null;
  userAgent?: string | null;
};

export function apiBaseUrl(): string {
  const url =
    process.env.API_URL ??
    (process.env.NODE_ENV === "production" ? undefined : "http://localhost:3333");
  if (!url) throw new Error("Defina API_URL (endereço da api-backend).");
  return url.replace(/\/+$/, "");
}

type CallOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
  client?: ForwardedClient;
};

export async function callApi<T>(path: string, options: CallOptions = {}): Promise<T> {
  const headers: Record<string, string> = { accept: "application/json" };
  if (options.body !== undefined) headers["content-type"] = "application/json";
  if (options.token) headers.authorization = `Bearer ${options.token}`;
  if (options.client?.ip) headers["x-forwarded-for"] = options.client.ip;
  if (options.client?.userAgent) headers["user-agent"] = options.client.userAgent;

  // Fora do try: API_URL ausente é erro de configuração, não "API fora do ar".
  const url = `${apiBaseUrl()}${path}`;
  let response: Response;
  try {
    response = await fetch(url, {
      method: options.method ?? "GET",
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      cache: "no-store",
    });
  } catch (error) {
    console.error(`[auth] API inacessível: ${options.method ?? "GET"} ${url}`, error);
    throw new ApiError(0, "API_UNREACHABLE", "API unreachable");
  }

  if (response.status === 204) return undefined as T;

  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const body = (data ?? {}) as { code?: string; message?: string; details?: unknown };
    throw new ApiError(
      response.status,
      body.code ?? "UNKNOWN",
      body.message ?? response.statusText,
      body.details,
    );
  }
  return data as T;
}
