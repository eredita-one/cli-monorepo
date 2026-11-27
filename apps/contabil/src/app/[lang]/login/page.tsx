import { sharedMessages } from "@repo/i18n/messages";
import { LanguageSwitcher } from "@repo/ui/language-switcher";
import { LoginForm } from "@repo/ui/login-form";
import { LoginView } from "@repo/ui/login-view";
import type { Metadata } from "next";
import { loginAction } from "@/auth-actions";
import { AppBrand, BRAND_NAME } from "@/brand";
import { LOCALE_COOKIE } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  return { title: sharedMessages[await getLocale()].auth.title };
}

export default async function LoginPage() {
  const locale = await getLocale();
  const shared = sharedMessages[locale].auth;
  const t = (await getDictionary()).login;

  return (
    <LoginView
      brand={<AppBrand />}
      tagline={t.tagline}
      description={t.description}
      footer={`${BRAND_NAME} · ${t.footer}`}
      heading={shared.heading}
      subheading={shared.subheading}
      form={
        <LoginForm
          action={loginAction}
          locale={locale}
          labels={shared.form}
          errors={shared.errors}
        />
      }
      languageSwitcher={<LanguageSwitcher cookieName={LOCALE_COOKIE} />}
    />
  );
}
