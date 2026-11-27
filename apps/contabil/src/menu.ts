import "server-only";
import { type MenuGroupConfig, resolveMenu } from "@repo/ui/dashboard/menu";
import {
  CalendarClock,
  CircleHelp,
  ClipboardCheck,
  FileText,
  Home,
  Landmark,
  LayoutDashboard,
  LockKeyhole,
  Users,
} from "lucide-react";
import { getDictionary } from "@/i18n/get-dictionary";

/**
 * Menu do contábil (protótipo "EREDITÀ TAX"): prazos, contribuintes, obrigações e documentos.
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
    id: "tax",
    icon: Landmark,
    open: true,
    items: [
      { id: "deadlines", path: "deadlines", icon: CalendarClock, soon: true },
      { id: "taxpayers", path: "taxpayers", icon: Users, soon: true },
      { id: "obligations", path: "obligations", icon: ClipboardCheck, soon: true },
    ],
  },
  {
    id: "properties",
    icon: Home,
    items: [
      { id: "cadastre", path: "cadastre", icon: Home, soon: true },
    ],
  },
  {
    id: "documents",
    icon: FileText,
    items: [
      { id: "archive", path: "archive", icon: LockKeyhole, soon: true },
      { id: "banking", path: "banking", icon: Landmark, soon: true },
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
