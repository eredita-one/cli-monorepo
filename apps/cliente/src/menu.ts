import "server-only";
import { type MenuGroupConfig, resolveMenu } from "@repo/ui/dashboard/menu";
import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Calculator,
  CircleHelp,
  FileText,
  Globe2,
  Home,
  Landmark,
  LayoutDashboard,
  MessageSquare,
  Route,
  Tag,
  TrendingUp,
  UserRound,
  WalletCards,
} from "lucide-react";
import { getDictionary } from "@/i18n/get-dictionary";

/**
 * Menu do portal do cliente (protótipo "Eredità Private"): só os dados da própria pessoa.
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
    id: "assets",
    icon: Building2,
    open: true,
    items: [
      { id: "properties", path: "properties", icon: Home, soon: true },
      { id: "money", path: "money", icon: WalletCards, soon: true },
      { id: "strategy", path: "strategy", icon: TrendingUp, soon: true },
      { id: "resale", path: "resale", icon: Tag, soon: true },
    ],
  },
  {
    id: "tax",
    icon: Landmark,
    items: [
      { id: "taxes", path: "taxes", icon: FileText, soon: true },
      { id: "taxCenter", path: "tax-center", icon: Landmark, soon: true },
      { id: "taxBrazilItaly", path: "tax-brazil-italy", icon: Globe2, soon: true },
    ],
  },
  {
    id: "planning",
    icon: Route,
    items: [
      { id: "simulator", path: "simulator", icon: Calculator, soon: true },
      { id: "journey", path: "journey", icon: Route, soon: true },
    ],
  },
  {
    id: "account",
    icon: UserRound,
    items: [
      { id: "plan", path: "plan", icon: BadgeCheck, soon: true },
      { id: "personal", path: "personal", icon: UserRound, soon: true },
      { id: "services", path: "services", icon: BriefcaseBusiness, soon: true },
    ],
  },
  {
    id: "support",
    icon: CircleHelp,
    items: [
      { id: "requests", path: "requests", icon: MessageSquare, soon: true },
      { id: "help", path: "help", icon: CircleHelp, soon: true },
    ],
  },
] as const satisfies readonly MenuGroupConfig[];

export async function getMenu(locale: string) {
  return resolveMenu(MENU, { locale, labels: (await getDictionary()).menu });
}
