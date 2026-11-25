import { NotFoundView } from "@repo/ui/not-found";
import { getLocale } from "@/i18n/get-dictionary";

export default async function NotFound() {
  return <NotFoundView locale={await getLocale()} />;
}
