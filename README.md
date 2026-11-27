# Workspace Contábil

Monorepo pnpm com cinco apps Next.js 16 e os pacotes compartilhados entre eles.

```
apps/
  landing/              site público                     → http://localhost:3000
  contabil/             escritório contábil (TAX)        → http://localhost:3001
  admin/                gestão interna (Eredità ONE)     → http://localhost:3002
  consultor/            rede comercial (Eredità Partner) → http://localhost:3003
  cliente/              portal do cliente (Private)      → http://localhost:3004
packages/
  auth/                 ponte com a api-backend (login, sessão, proxy)
  i18n/                 idiomas, proxy de idioma, carregador de dicionários
  ui/                   componentes compartilhados (painel, login, marca, 404)
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

## Painel padrão (`@repo/ui/dashboard`)

Toda área logada usa o mesmo painel (barra lateral verde com contexto de trabalho, menu
em grupos, ajuda; cabeçalho com trilha, busca, notificações e conta; rodapé). Cada app só
passa a sua configuração:

- **Menu:** `apps/<app>/src/menu.ts` declara grupos e itens (`id`, `path`, ícone do
  `lucide-react`). Os textos ficam no dicionário do app, em `menu.groups` e `menu.items`
  (o TypeScript acusa id sem texto). `getMenu()` monta o menu de quem está logado; no admin
  ele esconde as seções de acesso sem permissão (`include`).
- **Moldura:** `apps/<app>/src/app/[lang]/(app)/layout.tsx` usa o `DashboardFrame` com a
  marca, a área (início da trilha), a página de ajuda e as funções que leem a sessão
  (`getMenu`, `getAccount`, `getWorkspace`). Elas rodam dentro de `<Suspense>`: a moldura sai
  estática e só essas partes esperam a API.
- **Módulos sem tela:** item com `soon: true` abre a página "em construção"
  (`(app)/[module]/page.tsx`), com a descrição de `modules.<id>` no dicionário. Quando o
  módulo ganhar tela, crie a pasta dele (ex.: `(app)/clients/`), que tem prioridade sobre
  `[module]`, e tire o `soon`.
- **Páginas:** `@repo/ui/dashboard/blocks` (cabeçalho da página, aviso, indicador principal,
  métricas, seção em card, "em construção") e `@repo/ui/dashboard/styles` (botões, tabela,
  campos).
- **Contexto de trabalho:** leva aos outros apps da equipe a que a pessoa tem acesso.
  O endereço de cada um vem de `APP_URL_ADMIN`, `APP_URL_CONSULTOR` e `APP_URL_CONTABIL`
  (em desenvolvimento, as portas locais; em produção, app sem variável não aparece).
- **Visual:** `packages/ui/src/dashboard/dashboard.css` (importado no `globals.css` de cada
  app) define o tema claro, o dourado (`gold-*`) e as cores de superfície e texto
  (`canvas`, `line`, `ink-*`). O app define só a sua paleta `brand-*`. O `dark:` só vale
  com a classe `.dark`, que ainda não é usada.

## Componentes compartilhados e Tailwind

O Tailwind de cada app só gera classes dos arquivos que ele varre. Por isso o `globals.css`
de cada app tem `@source "../../../../packages/ui/src";`. Um app novo que use `@repo/ui`
precisa da mesma linha.

## Next.js 16

Esta versão do Next tem APIs novas (`proxy.ts`, `next/root-params`, Cache Components).
Antes de escrever código, consulte a documentação que vem no pacote:
`node_modules/next/dist/docs/` (veja o `AGENTS.md` de cada app).
