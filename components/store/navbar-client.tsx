"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/store/navbar";

export default function NavbarClient({
  locale,
  labels,
}: {
  locale: "en" | "ar";
  labels: {
    cart: string;
    emptyCart: string;
    total: string;
    checkout: string;
    search: string;
    account: string;
    orders: string;
    admin: string;
    signIn: string;
    signOut: string;
    signedIn: string;
    signedOut: string;
  };
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <Navbar locale={locale} labels={labels} />;
}
