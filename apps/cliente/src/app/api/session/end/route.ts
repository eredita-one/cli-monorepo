import { createSessionEndHandler } from "@repo/auth/server";
import { AUTH } from "@/auth-config";

/** Apaga a sessão e volta ao login (usado quando a API recusa o token). */
export const GET = createSessionEndHandler(AUTH);
