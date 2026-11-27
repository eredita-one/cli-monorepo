import "server-only";
import { type MenuGroupConfig, resolveMenu } from "@repo/ui/dashboard/menu";
import {
  BriefcaseBusiness,
  CalendarDays,
  CircleHelp,
  LayoutDashboard,
  Network,
  Users,
  WalletCards,
} from "lucide-react";
import { getDictionary } from "@/i18n/get-dictionary";

/**
 * Menu do Partner (protótipo "Eredità Partner"): carteira, rede e comissões do consultor.
 * Os textos ficam em `menu` no dicionário; os itens `soon` ainda não têm tela e abrem
 * a página "em construção" (`[module]`), com a descrição de `modules`.
 */
export const MENU = [
  {
    id: "overview",
    icon: LayoutDashboard,
    items: [
      { id: "overview", path: "", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    id: "portfolio",
    icon: BriefcaseBusiness,
    open: true,
    items: [
      { id: "clients", path: "clients", icon: Users, soon: true },
      { id: "calendar", path: "calendar", icon: CalendarDays, soon: true },
    ],
  },
  {
    id: "network",
    icon: Network,
    items: [
      { id: "team", path: "team", icon: Network, soon: true },
      { id: "commissions", path: "commissions", icon: WalletCards, soon: true },
    ],
  },
  {
    id: "support",
    icon: CircleHelp,
    items: [
      { id: "help", path: "help", icon: CircleHelp, soon: true },
    ],
  },
] as const satisfies readonly MenuGroupConfig[];

export async function getMenu(locale: string) {
  return resolveMenu(MENU, { locale, labels: (await getDictionary()).menu });
}
