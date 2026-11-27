import "server-only";
import { type MenuGroupConfig, resolveMenu } from "@repo/ui/dashboard/menu";
import {
  Activity,
  BriefcaseBusiness,
  Building2,
  Calculator,
  CalendarDays,
  CircleHelp,
  FileText,
  Globe2,
  Handshake,
  Home,
  Landmark,
  LayoutDashboard,
  LockKeyhole,
  ScrollText,
  Shield,
  ShieldCheck,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react";
import { requireUser } from "@/auth";
import { getDictionary } from "@/i18n/get-dictionary";
import { canAny, SECTIONS } from "@/lib/access";

/**
 * Menu do admin (protótipo "Eredità ONE"). Os textos ficam em `menu` no dicionário; os
 * itens `soon` ainda não têm tela e abrem a página "em construção" (`[module]`), com a
 * descrição de `modules`. Quando um módulo ganhar tela, crie a pasta dele e tire o `soon`.
 */
export const MENU = [
  {
    id: "overview",
    icon: LayoutDashboard,
    items: [{ id: "overview", path: "", icon: LayoutDashboard, exact: true }],
  },
  {
    id: "relationship",
    icon: Handshake,
    open: true,
    items: [
      { id: "clients", path: "clients", icon: Users, soon: true },
      { id: "client360", path: "client-360", icon: UserRound, soon: true },
      { id: "timeline", path: "timeline", icon: Activity, soon: true },
    ],
  },
  {
    id: "assets",
    icon: Building2,
    items: [
      { id: "properties", path: "properties", icon: Home, soon: true },
      { id: "wealthStrategy", path: "wealth-strategy", icon: WalletCards, soon: true },
      { id: "relocation", path: "relocation", icon: Building2, soon: true },
    ],
  },
  {
    id: "finance",
    icon: WalletCards,
    items: [
      { id: "entries", path: "entries", icon: Calculator, soon: true },
      { id: "taxes", path: "taxes", icon: FileText, soon: true },
      { id: "revenue", path: "revenue", icon: WalletCards, soon: true },
      { id: "taxDossier", path: "tax-dossier", icon: FileText, soon: true },
      { id: "taxCenter", path: "tax-center", icon: Landmark, soon: true },
      { id: "taxBrazilItaly", path: "tax-brazil-italy", icon: Globe2, soon: true },
    ],
  },
  {
    id: "operations",
    icon: BriefcaseBusiness,
    items: [
      { id: "operations", path: "operations", icon: BriefcaseBusiness, soon: true },
      { id: "services", path: "services", icon: FileText, soon: true },
      { id: "restrictedArchive", path: "restricted-archive", icon: LockKeyhole, soon: true },
    ],
  },
  {
    id: "administration",
    icon: Shield,
    items: [
      { id: "users", path: "users", icon: Users },
      { id: "profiles", path: "profiles", icon: ShieldCheck },
      { id: "audit", path: "audit", icon: ScrollText },
    ],
  },
  {
    id: "support",
    icon: CircleHelp,
    items: [
      { id: "help", path: "help", icon: CircleHelp, soon: true },
      { id: "agenda", path: "agenda", icon: CalendarDays, soon: true },
    ],
  },
] as const satisfies readonly MenuGroupConfig[];

/** Menu de quem está logado: as seções de acesso só aparecem para quem pode usá-las. */
export async function getMenu(locale: string) {
  const [user, dict] = await Promise.all([requireUser(), getDictionary()]);
  return resolveMenu(MENU, {
    locale,
    labels: dict.menu,
    include: (item) => !(item.id in SECTIONS) || canAny(user, SECTIONS[item.id as keyof typeof SECTIONS]),
  });
}
