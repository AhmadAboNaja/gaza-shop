"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { setLocale } from "@/app/actions/set-locale";
import { Button } from "@/components/ui/button";

export function LocaleSwitcher({ current }: { current: "en" | "ar" }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const toggle = () => {
    const next = current === "en" ? "ar" : "en";
    startTransition(async () => {
      await setLocale(next);
      const qs = searchParams.toString();
      router.push(`${pathname}${qs ? `?${qs}` : ""}`);
      router.refresh();
    });
  };

  return (
    <Button variant="outline" onClick={toggle} disabled={isPending}>
      {current === "en" ? "AR" : "EN"}
    </Button>
  );
}
