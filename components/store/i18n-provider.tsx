import { cookies } from "next/headers";
import { defaultLocale, dictionary, type Locale } from "@/lib/i18n";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("locale")?.value;
  return cookie === "ar" || cookie === "en" ? cookie : defaultLocale;
}

export async function useDictionary() {
  const locale = await getLocale();
  return { locale, t: dictionary[locale] };
}

export async function getDictionary() {
  const locale = await getLocale();
  return { locale, t: dictionary[locale] };
}
