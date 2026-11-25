# Workspace Contábil

Monorepo pnpm com dois apps Next.js 16 e os pacotes compartilhados entre eles.

```
apps/
  landing/              site público                     → http://localhost:3000
  contabil/             sistema interno de contabilidade → http://localhost:3001
packages/
  i18n/                 idiomas, proxy de idioma, carregador de dicionários
  ui/                   componentes compartilhados (Brand, LanguageSwitcher, NotFoundView)
  typescript-config/    tsconfig base (base.json, nextjs.json)
  eslint-config/        ESLint compartilhado (next, library)
```

## Comandos (na raiz)

Use sempre **pnpm** (não npm/yarn).

```bash
pnpm install
pnpm dev               # os dois apps em paralelo
pnpm dev:landing       # só a landing (porta 3000)
pnpm dev:contabil      # só o contabil (porta 3001)
pnpm build             # build de todos os apps
pnpm lint              # lint de apps e pacotes
pnpm typecheck         # checagem de tipos de apps e pacotes
```

Em produção, `next start` usa a porta da variável `PORT` (padrão 3000).

## Dependências

As versões de `next`, `react`, `typescript`, `tailwindcss`, `eslint` etc. ficam **só** no
`catalog` do `pnpm-workspace.yaml`. Nos `package.json`, use `"catalog:"`; para pacotes
internos, `"workspace:*"`. Para atualizar o Next, mude a versão no catálogo e rode `pnpm install`.

## Idiomas (i18n)

Idiomas: italiano (`it`, **oficial e padrão**), português (`pt`), espanhol (`es`) e inglês (`en`).

- Toda rota tem o idioma na URL: `/it/...`, `/pt/...`. Quem acessa uma URL sem idioma
  é redirecionado (`src/proxy.ts` de cada app) para o idioma salvo no cookie ou, na
  falta dele, para o italiano. O idioma do navegador não é considerado.
- O cookie só é gravado quando o usuário escolhe um idioma no seletor. Cada app tem o
  seu cookie (`landing-locale`, `contabil-locale`); entre os apps, o idioma vai na URL.
- A lista de idiomas e o padrão ficam em `packages/i18n/src/config.ts`. Adicionar um
  idioma: inclua-o ali, crie o `<idioma>.json` em cada app e acrescente-o em
  `packages/i18n/src/messages.ts`; o TypeScript aponta o que faltar.

### Textos

- **Do app**: `apps/<app>/src/i18n/dictionaries/<idioma>.json`. O `it.json` é a referência:
  se faltar uma chave em outro idioma, o typecheck/build falha.
- **Dos componentes compartilhados** (seletor de idioma, página 404): `packages/i18n/src/messages.ts`.

Em Server Components:

```tsx
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

const dict = await getDictionary();
```

Client Components não leem o dicionário: recebem os textos por props (veja
`apps/contabil/src/app/[lang]/login/_components/login-form.tsx`).

### Página 404

URLs inexistentes dentro de um idioma (`/it/xyz`) caem em `[lang]/[...rest]` e mostram a
página 404 traduzida (`[lang]/not-found.tsx`). A resposta sai com status 404 e `noindex`,
mas, por causa do Cache Components, o conteúdo é montado no navegador (o HTML do servidor
vem sem ele).

## Componentes compartilhados e Tailwind

O Tailwind de cada app só gera classes dos arquivos que ele varre. Por isso o `globals.css`
de cada app tem `@source "../../../../packages/ui/src";`. Um app novo que use `@repo/ui`
precisa da mesma linha.

## Next.js 16

Esta versão do Next tem APIs novas (`proxy.ts`, `next/root-params`, Cache Components).
Antes de escrever código, consulte a documentação que vem no pacote:
`node_modules/next/dist/docs/` (veja o `AGENTS.md` de cada app).
