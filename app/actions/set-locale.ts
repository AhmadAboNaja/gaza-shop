"use server";

import { cookies } from "next/headers";

export async function setLocale(locale: "en" | "ar") {
  const store = await cookies();
  store.set("locale", locale, { path: "/" });
}
