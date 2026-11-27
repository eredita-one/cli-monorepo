import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

// Menu do painel. Cada app declara o seu (grupos e itens, com ícones) num arquivo de
// configuração; os textos vêm do dicionário do app. `resolveMenu` junta os dois e entrega
// à tela só dados e elementos (é o que pode ir do servidor para os Client Components).

/** Item do menu como o app o declara. `path` é relativo ao idioma: `""` é a página inicial. */
export type MenuItemConfig<Id extends string = string> = {
  id: Id;
  path: string;
  icon: LucideIcon;
  /** Ativo só no endereço exato (use na página inicial). */
  exact?: boolean;
  /** Módulo ainda sem tela: o endereço abre a página "em construção". */
  soon?: boolean;
};

export type MenuGroupConfig<GroupId extends string = string, ItemId extends string = string> = {
  id: GroupId;
  icon: LucideIcon;
  items: readonly MenuItemConfig<ItemId>[];
  /** Começa aberto mesmo sem o item ativo dentro. */
  open?: boolean;
};

/** Item pronto para a tela. */
export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
  exact?: boolean;
};

export type NavGroup = {
  id: string;
  label: string;
  icon: ReactNode;
  items: NavItem[];
  open?: boolean;
};

/**
 * Monta o menu da tela: textos do dicionário, endereços com o idioma e só os itens que
 * `include` deixar (ex.: por permissão; esconder é conforto, quem nega de fato é a API).
 * Grupos que ficam vazios somem. O dicionário precisa ter um texto para cada id.
 */
export function resolveMenu<GroupId extends string, ItemId extends string>(
  groups: readonly MenuGroupConfig<GroupId, ItemId>[],
  options: {
    locale: string;
    labels: { groups: Record<GroupId, string>; items: Record<ItemId, string> };
    include?: (item: MenuItemConfig<ItemId>) => boolean;
  },
): NavGroup[] {
  const { locale, labels, include } = options;
  return groups
    .map((group) => ({
      id: group.id,
      label: labels.groups[group.id],
      icon: <group.icon aria-hidden className="size-4" />,
      open: group.open,
      items: group.items
        .filter((item) => include?.(item) ?? true)
        .map((item) => ({
          id: item.id,
          label: labels.items[item.id],
          href: item.path ? `/${locale}/${item.path}` : `/${locale}`,
          icon: <item.icon aria-hidden strokeWidth={1.8} className="size-[17px]" />,
          exact: item.exact,
        })),
    }))
    .filter((group) => group.items.length > 0);
}

/** Item `soon` de um menu declarado com `as const` (o tipo guarda os ids exatos). */
export type SoonItem<Groups extends readonly MenuGroupConfig[]> = Extract<
  Groups[number]["items"][number],
  { soon: true }
>;

/** Itens marcados como `soon`: os módulos que a página "em construção" atende. */
export function soonItems<const Groups extends readonly MenuGroupConfig[]>(
  groups: Groups,
): SoonItem<Groups>[] {
  return groups.flatMap((group) => group.items.filter((item) => item.soon)) as SoonItem<Groups>[];
}

/** Item do menu que corresponde ao endereço (o mais específico vence). */
export function findActiveItem(groups: readonly NavGroup[], pathname: string) {
  let best: (NavItem & { group: string }) | undefined;
  for (const group of groups) {
    for (const item of group.items) {
      const matches = item.exact
        ? pathname === item.href
        : pathname === item.href || pathname.startsWith(`${item.href}/`);
      if (matches && (!best || item.href.length > best.href.length)) {
        best = { ...item, group: group.id };
      }
    }
  }
  return best;
}
